# @wyre-ai/node-kaseya-quote-manager

Node.js/TypeScript client library for the [Kaseya Quote Manager](https://help.quotemanager.kaseya.com/) (Datto Commerce) API.

The Quote Manager API is **read-only**. This client exposes `list` and `get` for every
documented resource, with built-in retry, a client-side rate limiter, and typed responses.

## Install

```bash
npm install @wyre-ai/node-kaseya-quote-manager
```

> Published to GitHub Packages. Configure your `.npmrc`:
> ```
> @wyre-ai:registry=https://npm.pkg.github.com
> ```

## Quick start

```ts
import { KaseyaQuoteManagerClient } from '@wyre-ai/node-kaseya-quote-manager';

const client = new KaseyaQuoteManagerClient({
  apiKey: process.env.KASEYA_QUOTE_MANAGER_API_KEY!,
});

// List recent quotes
const quotes = await client.quotes.list({ page: 1, pageSize: 50 });

// Get one quote and its sections + lines
const quote = await client.quotes.get(12345);
const sections = await client.quoteSections.list({ quoteID: quote.id });
const lines = await client.quoteLines.list({ quoteSectionID: sections[0]?.id });
```

## Authentication

Quote Manager authenticates with a single **API key** sent in the `apiKey` request header.
Generate one in Quote Manager under **Settings → API**. The base URL is
`https://api.kaseyaquotemanager.com`.

## Resources

Every resource supports `.list(params?)`; all except `productImages` also support `.get(id)`.

| Accessor | Resource | List filters (beyond `page`/`pageSize`/`modifiedAfter`) |
|----------|----------|---------------------------------------------------------|
| `quotes` | Quotes | `quoteNumber` |
| `quoteSections` | Quote sections | `quoteID` |
| `quoteLines` | Quote line items | `quoteSectionID` |
| `salesOrders` | Sales orders | `orderNumber` |
| `salesOrderLines` | Sales order lines | `salesOrderID` |
| `salesOrderPayments` | Sales order payments | `salesOrderID` |
| `purchaseOrders` | Purchase orders | `orderNumber` |
| `purchaseOrderLines` | Purchase order lines | `purchaseOrderID` |
| `purchaseOrderCosts` | Purchase order costs | `purchaseOrderID` |
| `suppliers` | Suppliers | — |
| `productSuppliers` | Product/supplier links | `productID` |
| `products` | Products | `manufacturerPartNumber` |
| `productImages` | Product images (list only) | `productID` |
| `categories` | Product categories | — |
| `brands` | Brands | — |
| `customers` | Customers | — |
| `customerAddress` | Customer addresses | `customerID` |
| `contacts` | Customer contacts | `customerID` |
| `employees` | Employees | — |
| `warehouses` | Warehouses | — |

## Pagination

Results are paginated. `pageSize` maxes out at **100**; iterate `page` (1-based) until a
short page is returned. `modifiedAfter` (ISO 8601) filters to records changed after a
timestamp on resources that support it.

## Rate limits

The API allows **60 requests/minute** per API key. The API spec says **10,000 requests a
day**; a Kaseya help article says 20,000. Plan for the lower number: **10,000 calls a day
per API key**. The daily budget is not tracked by the client, so share it across your
processes yourself.

The client throttles to 60/min per client instance by default (`rateLimitPerMinute`).
Two instances using the same key can still exceed the limit together.

Retries (`maxRetries`, default 3) apply to `GET` and `HEAD` only; any other method fails on
the first error. Retried cases:

- `429`: waits the `Retry-After` value (seconds or HTTP date) capped at 60 s. If the header
  is missing or unparsable, it uses the exponential backoff below.
- `5xx` and network errors/timeouts: exponential backoff of 1 s, 2 s, 4 s, ... capped at 30 s.

Other options:

| Option | Default | Description |
|--------|---------|-------------|
| `maxResponseBytes` | `10485760` (10 MiB) | Responses are read as a stream and abandoned once they pass this size. Throws `ResponseTooLargeError`. |
| `timeoutMs` | `30000` | Per-attempt request timeout. A timeout counts as a network error (and is retried like one). |

## Error handling

All errors extend `KaseyaQuoteManagerError` (`statusCode`, `response`):

```ts
import { NotFoundError, RateLimitError } from '@wyre-ai/node-kaseya-quote-manager';

try {
  await client.quotes.get(999999);
} catch (err) {
  if (err instanceof NotFoundError) { /* ... */ }
  if (err instanceof RateLimitError) { console.log(err.retryAfter); }
}
```

`AuthenticationError` (401), `ForbiddenError` (403), `NotFoundError` (404),
`ValidationError` (400), `RateLimitError` (429, `retryAfter` in seconds, 60 if the server sent none), `ServerError` (5xx).

Also:

- `InvalidIdError` (`statusCode` 0): `get(id)` only accepts a positive whole number (or a string of digits).
  Anything else, such as `'../x'`, `0` or `1.5`, throws before any request is sent.
- `ResponseTooLargeError` (`statusCode` is the HTTP status of the oversized response, `response` is
  undefined): the body exceeded `maxResponseBytes` and was not read. It is never retried. Use a smaller
  `pageSize`, narrower filters, or raise `maxResponseBytes`.
- A network failure or timeout after all retries throws a `KaseyaQuoteManagerError` with `statusCode` 0.
  The underlying error is available as `cause`.
- A `200` that says it is JSON but does not parse throws a `KaseyaQuoteManagerError` that does not echo the body.
- Redirects are never followed (following one would resend the `apiKey` header to another host). A `3xx` throws.

For error responses, the (size-capped) body is available on `.response`.

## License

Apache-2.0 © WYRE Technology
