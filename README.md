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
| `customerAddresses` | Customer addresses | `customerID` |
| `contacts` | Customer contacts | `customerID` |
| `employees` | Employees | — |
| `warehouses` | Warehouses | — |

## Pagination

Results are paginated. `pageSize` maxes out at **100**; iterate `page` (1-based) until a
short page is returned. `modifiedAfter` (ISO 8601) filters to records changed after a
timestamp on resources that support it.

## Rate limits

The API allows **60 requests/minute** and **20,000/day**. The client throttles to 60/min
by default (`rateLimitPerMinute`) and transparently retries `429` and `5xx` responses with
backoff (`maxRetries`, default 3).

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
`ValidationError` (400), `RateLimitError` (429), `ServerError` (5xx).

## License

Apache-2.0 © WYRE Technology
