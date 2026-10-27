import { describe, it, expect, vi } from 'vitest';
import { http, HttpResponse, delay } from 'msw';
import {
  KaseyaQuoteManagerClient,
  KaseyaQuoteManagerError,
  InvalidIdError,
  RateLimitError,
  ResponseTooLargeError,
  ServerError,
} from '../../src/index.js';
import { HttpClient, pathId, retryAfterSeconds } from '../../src/http.js';
import { RateLimiter } from '../../src/rate-limiter.js';
import { server } from '../mocks/server.js';

const BASE = 'https://api.kaseyaquotemanager.com';

function makeHttp(opts: { maxRetries?: number; maxResponseBytes?: number; timeoutMs?: number } = {}) {
  const sleep = vi.fn(async (_ms: number) => undefined);
  const client = new HttpClient({
    baseUrl: BASE,
    apiKey: 'test-key',
    maxRetries: opts.maxRetries ?? 3,
    rateLimiter: new RateLimiter(10_000),
    maxResponseBytes: opts.maxResponseBytes,
    timeoutMs: opts.timeoutMs,
    sleep,
  });
  return { client, sleep };
}

function chunked(chunks: string[]): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const c of chunks) controller.enqueue(enc.encode(c));
      controller.close();
    },
  });
}

describe('response size cap', () => {
  it('rejects when declared Content-Length is over the cap', async () => {
    let count = 0;
    server.use(
      http.get(`${BASE}/v1/quote`, () => {
        count++;
        return new HttpResponse('[]', {
          headers: { 'Content-Type': 'application/json', 'Content-Length': '5000' },
        });
      }),
    );
    const { client } = makeHttp({ maxResponseBytes: 100 });
    const err = await client.request('/v1/quote').catch(e => e);
    expect(err).toBeInstanceOf(ResponseTooLargeError);
    expect(err.message).toBe(
      'Quote Manager sent a response larger than 100 bytes, so it was not read. Narrow the request with a smaller pageSize or filters, or raise maxResponseBytes.',
    );
    expect(err.statusCode).toBe(200);
    expect(err.response).toBeUndefined();
    expect(count).toBe(1);
  });

  it('rejects a chunked body over the cap without retrying', async () => {
    let count = 0;
    server.use(
      http.get(`${BASE}/v1/quote`, () => {
        count++;
        return new HttpResponse(chunked(['["', 'a'.repeat(60), '", "', 'b'.repeat(60), '"]']), {
          headers: { 'Content-Type': 'application/json' },
        });
      }),
    );
    const { client, sleep } = makeHttp({ maxResponseBytes: 100 });
    await expect(client.request('/v1/quote')).rejects.toBeInstanceOf(ResponseTooLargeError);
    expect(count).toBe(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('reads bodies under the cap', async () => {
    server.use(
      http.get(`${BASE}/v1/quote`, () =>
        new HttpResponse(chunked(['[{"id":', '1}]']), { headers: { 'Content-Type': 'application/json' } })),
    );
    const { client } = makeHttp({ maxResponseBytes: 100 });
    await expect(client.request('/v1/quote')).resolves.toEqual([{ id: 1 }]);
  });

  it('applies the cap to error responses too', async () => {
    let count = 0;
    server.use(
      http.get(`${BASE}/v1/quote`, () => {
        count++;
        return new HttpResponse(chunked(['x'.repeat(80), 'y'.repeat(80)]), { status: 500 });
      }),
    );
    const { client } = makeHttp({ maxResponseBytes: 100 });
    const err = await client.request('/v1/quote').catch(e => e);
    expect(err).toBeInstanceOf(ResponseTooLargeError);
    expect(err.statusCode).toBe(500);
    expect(count).toBe(1);
  });

  it('is configurable through the client config', async () => {
    server.use(
      http.get(`${BASE}/v1/brand`, () => HttpResponse.json([{ id: 1 }, { id: 2 }, { id: 3 }])),
    );
    const client = new KaseyaQuoteManagerClient({ apiKey: 'k', maxResponseBytes: 5 });
    await expect(client.brands.list()).rejects.toBeInstanceOf(ResponseTooLargeError);
  });
});

describe('pathId', () => {
  it.each([
    [1, '1'],
    [12345, '12345'],
    [Number.MAX_SAFE_INTEGER, String(Number.MAX_SAFE_INTEGER)],
    ['1', '1'],
    ['987654', '987654'],
  ])('accepts %s', (input, expected) => {
    expect(pathId(input)).toBe(expected);
  });

  it.each([
    '', '.', '..', '../x', '%2e%2e', '1/2', '1?x', -1, 0, 1.5, NaN, Infinity, ' 1', '1 ', '01', '0', '-1',
    '1.5', '1e3', '١٢', '9007199254740993', Number.MAX_SAFE_INTEGER + 1, null, undefined, {}, [], [1], true,
  ])('rejects %j', input => {
    expect(() => pathId(input)).toThrow(InvalidIdError);
  });

  it('throws the exact error shape', () => {
    const err = (() => { try { pathId('..'); } catch (e) { return e as InvalidIdError; } })()!;
    expect(err).toBeInstanceOf(KaseyaQuoteManagerError);
    expect(err.message).toBe('Invalid id. Use a positive whole-number ID from a list or get call.');
    expect(err.statusCode).toBe(0);
    expect(err.response).toBeUndefined();
  });

  it('get() rejects a bad id without sending a request', async () => {
    let count = 0;
    server.use(
      http.get(`${BASE}/v1/*`, () => {
        count++;
        return HttpResponse.json({});
      }),
    );
    const client = new KaseyaQuoteManagerClient({ apiKey: 'k' });
    await expect(client.quotes.get('../x' as any)).rejects.toBeInstanceOf(InvalidIdError);
    await expect(client.brands.get(0)).rejects.toBeInstanceOf(InvalidIdError);
    expect(count).toBe(0);
  });
});

describe('retries', () => {
  const failures: Array<[string, () => Response]> = [
    ['500', () => new HttpResponse('boom', { status: 500 })],
    ['429', () => new HttpResponse('slow', { status: 429, headers: { 'Retry-After': '1' } })],
    ['network error', () => HttpResponse.error()],
  ];
  const writes = (['POST', 'PUT', 'PATCH', 'DELETE'] as const).flatMap((method) =>
    failures.map(([name, respond]) => [method, name, respond] as const),
  );

  it.each(writes)('does not retry %s on %s', async (method, _name, respond) => {
    let count = 0;
    const handler = { POST: http.post, PUT: http.put, PATCH: http.patch, DELETE: http.delete }[method];
    server.use(
      handler(`${BASE}/v1/quote`, () => {
        count++;
        return respond();
      }),
    );
    const { client, sleep } = makeHttp({ maxRetries: 3 });
    await expect(
      client.request('/v1/quote', { method, ...(method === 'DELETE' ? {} : { body: { a: 1 } }) }),
    ).rejects.toBeInstanceOf(KaseyaQuoteManagerError);
    expect(count).toBe(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('retries GET on 503 then succeeds', async () => {
    let count = 0;
    server.use(
      http.get(`${BASE}/v1/quote`, () => {
        count++;
        return count < 3 ? new HttpResponse(null, { status: 503 }) : HttpResponse.json([{ id: 1 }]);
      }),
    );
    const { client, sleep } = makeHttp();
    await expect(client.request('/v1/quote')).resolves.toEqual([{ id: 1 }]);
    expect(count).toBe(3);
    expect(sleep.mock.calls.map(c => c[0])).toEqual([1000, 2000]);
  });

  it('throws ServerError after exhausting retries', async () => {
    let count = 0;
    server.use(
      http.get(`${BASE}/v1/quote`, () => {
        count++;
        return new HttpResponse(null, { status: 500 });
      }),
    );
    const { client } = makeHttp({ maxRetries: 2 });
    const err = await client.request('/v1/quote').catch(e => e);
    expect(err).toBeInstanceOf(ServerError);
    expect(err.message).toBe('Quote Manager had a server error (HTTP 500). Try again later.');
    expect(count).toBe(3);
  });

  it('retries 429 with Retry-After: 0', async () => {
    let count = 0;
    server.use(
      http.get(`${BASE}/v1/quote`, () => {
        count++;
        return count === 1
          ? new HttpResponse(null, { status: 429, headers: { 'Retry-After': '0' } })
          : HttpResponse.json([]);
      }),
    );
    const { client, sleep } = makeHttp();
    await expect(client.request('/v1/quote')).resolves.toEqual([]);
    expect(sleep).toHaveBeenCalledWith(0);
  });

  it('retries 429 with a past Retry-After HTTP date immediately', async () => {
    let count = 0;
    server.use(
      http.get(`${BASE}/v1/quote`, () => {
        count++;
        return count === 1
          ? new HttpResponse(null, {
              status: 429,
              headers: { 'Retry-After': 'Wed, 21 Oct 2015 07:28:00 GMT' },
            })
          : HttpResponse.json([]);
      }),
    );
    const { client, sleep } = makeHttp();
    await expect(client.request('/v1/quote')).resolves.toEqual([]);
    expect(sleep).toHaveBeenCalledWith(0);
  });

  it('waits the clamped Retry-After and falls back to backoff when absent', async () => {
    let count = 0;
    server.use(
      http.get(`${BASE}/v1/quote`, () => {
        count++;
        if (count === 1) return new HttpResponse(null, { status: 429, headers: { 'Retry-After': '3600' } });
        if (count === 2) return new HttpResponse(null, { status: 429 });
        return HttpResponse.json([]);
      }),
    );
    const { client, sleep } = makeHttp();
    await client.request('/v1/quote');
    expect(sleep.mock.calls.map(c => c[0])).toEqual([60_000, 2000]);
  });

  it('exposes RateLimitError with the exact message and clamped retryAfter', async () => {
    server.use(
      http.get(`${BASE}/v1/quote`, () => new HttpResponse(null, { status: 429, headers: { 'Retry-After': '9999' } })),
    );
    const { client } = makeHttp({ maxRetries: 0 });
    const err = await client.request('/v1/quote').catch(e => e);
    expect(err).toBeInstanceOf(RateLimitError);
    expect(err.message).toBe('Quote Manager is rate limiting requests (60 a minute, 10,000 a day per API key). Wait a minute and try again. If it keeps happening, the daily limit may be used up.');
    expect(err.retryAfter).toBe(60);

    server.use(http.get(`${BASE}/v1/quote`, () => new HttpResponse(null, { status: 429 })));
    const err2 = await client.request('/v1/quote').catch(e => e);
    expect(err2.retryAfter).toBe(60);
  });
});

describe('retryAfterSeconds', () => {
  const now = Date.parse('2026-01-01T00:00:00Z');
  it('parses delta-seconds and clamps to [0, 60]', () => {
    expect(retryAfterSeconds('5')).toBe(5);
    expect(retryAfterSeconds('0')).toBe(0);
    expect(retryAfterSeconds('120')).toBe(60);
  });
  it('parses HTTP dates relative to now', () => {
    expect(retryAfterSeconds('Thu, 01 Jan 2026 00:00:30 GMT', now)).toBe(30);
    expect(retryAfterSeconds('Thu, 01 Jan 2026 01:00:00 GMT', now)).toBe(60);
    expect(retryAfterSeconds('Wed, 31 Dec 2025 00:00:00 GMT', now)).toBe(0);
  });
  it('returns undefined when absent or unparsable', () => {
    expect(retryAfterSeconds(null)).toBeUndefined();
    expect(retryAfterSeconds('')).toBeUndefined();
    expect(retryAfterSeconds('soon')).toBeUndefined();
  });
});

describe('network errors', () => {
  it('throws a generic error that hides the underlying text', async () => {
    server.use(http.get(`${BASE}/v1/quote`, () => HttpResponse.error()));
    const { client } = makeHttp({ maxRetries: 1 });
    const err = await client.request('/v1/quote').catch(e => e);
    expect(err).toBeInstanceOf(KaseyaQuoteManagerError);
    expect(err.statusCode).toBe(0);
    expect(err.message).toBe('Request to Quote Manager failed or timed out. Check your network and try again.');
    expect(err.message).not.toContain('api.kaseyaquotemanager.com');
    expect(err.message).not.toContain('Failed to fetch');
    expect(err.cause).toBeDefined();
  });

  it('treats a timeout as a network error', async () => {
    let count = 0;
    server.use(
      http.get(`${BASE}/v1/quote`, async () => {
        count++;
        await delay('infinite');
        return HttpResponse.json([]);
      }),
    );
    const { client } = makeHttp({ maxRetries: 1, timeoutMs: 50 });
    const err = await client.request('/v1/quote').catch(e => e);
    expect(err).toBeInstanceOf(KaseyaQuoteManagerError);
    expect(err.statusCode).toBe(0);
    expect(err.message).toBe('Request to Quote Manager failed or timed out. Check your network and try again.');
    expect(count).toBe(2);
  });
});

describe('redirects and malformed bodies', () => {
  it('does not follow a redirect (the apiKey header must not reach another host)', async () => {
    let followed = false;
    server.use(
      http.get(`${BASE}/v1/quote`, () =>
        new HttpResponse(null, { status: 302, headers: { Location: 'https://evil.example/steal' } })),
      http.get('https://evil.example/steal', () => {
        followed = true;
        return HttpResponse.json([]);
      }),
    );
    const { client } = makeHttp({ maxRetries: 0 });
    // undici returns the 3xx as-is; msw surfaces it as an opaque redirect. Either way it is an error.
    await expect(client.request('/v1/quote')).rejects.toBeInstanceOf(KaseyaQuoteManagerError);
    expect(followed).toBe(false);
  });

  it('maps invalid JSON on a 200 to a fixed error without echoing the body', async () => {
    server.use(
      http.get(`${BASE}/v1/quote`, () =>
        new HttpResponse('{"not json SECRET', { status: 200, headers: { 'Content-Type': 'application/json' } })),
    );
    const { client } = makeHttp({ maxRetries: 0 });
    const err = await client.request('/v1/quote').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(KaseyaQuoteManagerError);
    expect((err as Error).message).toBe('Quote Manager sent a response that is not valid JSON. Try again later.');
    expect((err as Error).message).not.toContain('SECRET');
  });

  it('treats an empty JSON 200 body as an empty object', async () => {
    server.use(
      http.get(`${BASE}/v1/quote`, () =>
        new HttpResponse('', { status: 200, headers: { 'Content-Type': 'application/json' } })),
    );
    const { client } = makeHttp({ maxRetries: 0 });
    await expect(client.request('/v1/quote')).resolves.toEqual({});
  });
});
