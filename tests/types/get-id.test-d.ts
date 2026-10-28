// Compile-time checks, run by `npm run lint` (tsconfig.typetest.json). Not a vitest file.
import { KaseyaQuoteManagerClient } from '../../src/index.js';

type Eq<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
const assert = <T extends true>(): T => true as T;

const client = new KaseyaQuoteManagerClient({ apiKey: 'k' });

assert<Eq<Parameters<typeof client.brands.get>[0], number | string>>();
assert<Eq<Parameters<typeof client.categories.get>[0], number | string>>();
assert<Eq<Parameters<typeof client.contacts.get>[0], number | string>>();
assert<Eq<Parameters<typeof client.customers.get>[0], number | string>>();
assert<Eq<Parameters<typeof client.customerAddress.get>[0], number | string>>();
assert<Eq<Parameters<typeof client.employees.get>[0], number | string>>();
assert<Eq<Parameters<typeof client.products.get>[0], number | string>>();
// @ts-expect-error productImages has no get
void client.productImages.get;
assert<Eq<Parameters<typeof client.productSuppliers.get>[0], number | string>>();
assert<Eq<Parameters<typeof client.purchaseOrders.get>[0], number | string>>();
assert<Eq<Parameters<typeof client.purchaseOrderCosts.get>[0], number | string>>();
assert<Eq<Parameters<typeof client.purchaseOrderLines.get>[0], number | string>>();
assert<Eq<Parameters<typeof client.quotes.get>[0], number | string>>();
assert<Eq<Parameters<typeof client.quoteLines.get>[0], number | string>>();
assert<Eq<Parameters<typeof client.quoteSections.get>[0], number | string>>();
assert<Eq<Parameters<typeof client.salesOrders.get>[0], number | string>>();
assert<Eq<Parameters<typeof client.salesOrderLines.get>[0], number | string>>();
assert<Eq<Parameters<typeof client.salesOrderPayments.get>[0], number | string>>();
assert<Eq<Parameters<typeof client.suppliers.get>[0], number | string>>();
assert<Eq<Parameters<typeof client.warehouses.get>[0], number | string>>();

void client.quotes.get(1);
void client.quotes.get('1');
// @ts-expect-error booleans are not valid ids
void client.quotes.get(true);
// @ts-expect-error ids are required
void client.quotes.get();
