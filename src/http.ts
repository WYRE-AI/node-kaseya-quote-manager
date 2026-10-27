import { RateLimiter } from './rate-limiter.js';
import {
  KaseyaQuoteManagerError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ValidationError,
  InvalidIdError,
  ResponseTooLargeError,
} from './errors.js';

export interface HttpClientConfig {
  baseUrl: string;
  apiKey: string;
  maxRetries: number;
  rateLimiter: RateLimiter;
  /** Max response body size in bytes. Default 10 MiB. */
  maxResponseBytes?: number;
  /** Per-attempt request timeout in ms. Default 30000. */
  timeoutMs?: number;
  /** Delay function used between retries (injectable for tests). */
  sleep?: (ms: number) => Promise<void>;
}

export interface RequestOptions {
  method?: string;
  params?: Record<string, unknown>;
  body?: unknown;
}

const DEFAULT_MAX_RESPONSE_BYTES = 10 * 1024 * 1024;
const DEFAULT_TIMEOUT_MS = 30_000;
const NETWORK_ERROR_MESSAGE = 'Request to Quote Manager failed or timed out. Check your network and try again.';
const INVALID_JSON_MESSAGE = 'Quote Manager sent a response that is not valid JSON. Try again later.';
const defaultSleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

/** Parse a Retry-After header (delta-seconds or HTTP date) into seconds clamped to [0, 60]. */
export function retryAfterSeconds(value: string | null, now = Date.now()): number | undefined {
  const v = value?.trim();
  if (!v) return undefined;
  const seconds = /^\d+(\.\d+)?$/.test(v) ? Number(v) : (Date.parse(v) - now) / 1000;
  return Number.isFinite(seconds) ? Math.min(60, Math.max(0, seconds)) : undefined;
}

/** Validate an ID for use in a URL path. Accepts only positive safe integers (number or digit string). */
export function pathId(id: unknown): string {
  if (typeof id === 'number') {
    if (Number.isSafeInteger(id) && id > 0) return String(id);
  } else if (typeof id === 'string' && /^[1-9][0-9]*$/.test(id)) {
    const n = Number(id);
    if (Number.isSafeInteger(n) && n > 0) return String(n);
  }
  throw new InvalidIdError();
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly maxRetries: number;
  private readonly rateLimiter: RateLimiter;
  private readonly maxResponseBytes: number;
  private readonly timeoutMs: number;
  private readonly sleep: (ms: number) => Promise<void>;

  constructor(config: HttpClientConfig) {
    // Normalize: drop any trailing slash so `${baseUrl}${path}` joins cleanly.
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.apiKey = config.apiKey;
    this.maxRetries = config.maxRetries;
    this.rateLimiter = config.rateLimiter;
    this.maxResponseBytes = config.maxResponseBytes ?? DEFAULT_MAX_RESPONSE_BYTES;
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.sleep = config.sleep ?? defaultSleep;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', params, body } = options;
    // Only idempotent methods are retried; anything else fails on the first error.
    const upper = method.toUpperCase();
    const maxRetries = upper === 'GET' || upper === 'HEAD' ? this.maxRetries : 0;

    let url = `${this.baseUrl}${path}`;
    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      }
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    const backoffMs = (attempt: number) => Math.min(1000 * 2 ** attempt, 30_000);

    for (let attempt = 0; ; attempt++) {
      await this.rateLimiter.acquire();

      // Kaseya Quote Manager / Datto Commerce authenticates with a single API key
      // passed in the `apiKey` request header (not Authorization).
      const headers: Record<string, string> = {
        apiKey: this.apiKey,
        Accept: 'application/json',
      };
      if (body) headers['Content-Type'] = 'application/json';

      let response: Response;
      let rawText: string;
      try {
        response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          // Never follow redirects: fetch would resend the apiKey header to the new host.
          redirect: 'manual',
          signal: AbortSignal.timeout(this.timeoutMs),
        });
        rawText = await this.readBounded(response);
      } catch (err) {
        if (err instanceof KaseyaQuoteManagerError) throw err;
        if (attempt < maxRetries) {
          await this.sleep(backoffMs(attempt));
          continue;
        }
        // Do not echo the underlying error text: it can contain the request URL.
        throw new KaseyaQuoteManagerError(NETWORK_ERROR_MESSAGE, 0, undefined, { cause: err });
      }

      if (response.ok) {
        if (response.status === 204) return {} as T;
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          if (!rawText) return {} as T;
          try {
            return JSON.parse(rawText) as T;
          } catch {
            throw new KaseyaQuoteManagerError(INVALID_JSON_MESSAGE, response.status, undefined);
          }
        }
        return {} as T;
      }

      let responseBody: unknown;
      try { responseBody = JSON.parse(rawText); }
      catch { responseBody = rawText; }

      switch (response.status) {
        case 400:
          throw new ValidationError('Bad request', [], responseBody);
        case 401:
          throw new AuthenticationError('Authentication failed — check the apiKey', responseBody);
        case 403:
          throw new ForbiddenError('Forbidden', responseBody);
        case 404:
          throw new NotFoundError('Resource not found', responseBody);
        case 429: {
          const wait = retryAfterSeconds(response.headers.get('retry-after'));
          if (attempt < maxRetries) {
            await this.sleep(wait === undefined ? backoffMs(attempt) : wait * 1000);
            continue;
          }
          throw new RateLimitError(
            'Quote Manager is rate limiting requests (60 a minute, 10,000 a day per API key). Wait a minute and try again. If it keeps happening, the daily limit may be used up.',
            wait ?? 60,
            responseBody,
          );
        }
        default:
          if (response.status >= 500) {
            if (attempt < maxRetries) {
              await this.sleep(backoffMs(attempt));
              continue;
            }
            throw new ServerError(`Quote Manager had a server error (HTTP ${response.status}). Try again later.`, responseBody);
          }
          throw new KaseyaQuoteManagerError(`HTTP ${response.status}`, response.status, responseBody);
      }
    }
  }

  /** Read a response body as text, aborting as soon as it exceeds maxResponseBytes. */
  private async readBounded(response: Response): Promise<string> {
    const cap = this.maxResponseBytes;
    const tooLarge = () => new ResponseTooLargeError(cap, response.status);
    const declared = response.headers.get('content-length');
    if (declared && Number.isFinite(Number(declared)) && Number(declared) > cap) {
      await response.body?.cancel().catch(() => undefined);
      throw tooLarge();
    }
    if (!response.body) return '';
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let total = 0;
    let text = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > cap) {
        await reader.cancel().catch(() => undefined);
        throw tooLarge();
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  }
}
