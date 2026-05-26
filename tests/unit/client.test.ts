import { describe, it, expect } from 'vitest';
import { KaseyaQuoteManagerClient, AuthenticationError } from '../../src/index.js';
import { server } from '../mocks/server.js';
import { http, HttpResponse } from 'msw';

const client = new KaseyaQuoteManagerClient({ apiKey: 'test-key' });

describe('KaseyaQuoteManagerClient', () => {
  it('requires an apiKey', () => {
    // @ts-expect-error intentionally missing apiKey
    expect(() => new KaseyaQuoteManagerClient({})).toThrow('apiKey is required');
  });

  it('sends the apiKey header', async () => {
    let seen: string | null = null;
    server.use(
      http.get('https://api.kaseyaquotemanager.com/v1/quote', ({ request }) => {
        seen = request.headers.get('apiKey');
        return HttpResponse.json([]);
      }),
    );
    await client.quotes.list();
    expect(seen).toBe('test-key');
  });

  it('maps 401 to AuthenticationError', async () => {
    server.use(
      http.get('https://api.kaseyaquotemanager.com/v1/quote', () =>
        new HttpResponse(null, { status: 401 })),
    );
    await expect(client.quotes.list()).rejects.toBeInstanceOf(AuthenticationError);
  });
});

describe('resource coverage', () => {
  it('brands.list returns an array', async () => {
    const res = await client.brands.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('brands.get returns a record', async () => {
    const res = await client.brands.get(1);
    expect(res).toBeTruthy();
  });
  it('categories.list returns an array', async () => {
    const res = await client.categories.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('categories.get returns a record', async () => {
    const res = await client.categories.get(1);
    expect(res).toBeTruthy();
  });
  it('contacts.list returns an array', async () => {
    const res = await client.contacts.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('contacts.get returns a record', async () => {
    const res = await client.contacts.get(1);
    expect(res).toBeTruthy();
  });
  it('customers.list returns an array', async () => {
    const res = await client.customers.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('customers.get returns a record', async () => {
    const res = await client.customers.get(1);
    expect(res).toBeTruthy();
  });
  it('customerAddress.list returns an array', async () => {
    const res = await client.customerAddress.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('customerAddress.get returns a record', async () => {
    const res = await client.customerAddress.get(1);
    expect(res).toBeTruthy();
  });
  it('employees.list returns an array', async () => {
    const res = await client.employees.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('employees.get returns a record', async () => {
    const res = await client.employees.get(1);
    expect(res).toBeTruthy();
  });
  it('products.list returns an array', async () => {
    const res = await client.products.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('products.get returns a record', async () => {
    const res = await client.products.get(1);
    expect(res).toBeTruthy();
  });
  it('productImages.list returns an array', async () => {
    const res = await client.productImages.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('productSuppliers.list returns an array', async () => {
    const res = await client.productSuppliers.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('productSuppliers.get returns a record', async () => {
    const res = await client.productSuppliers.get(1);
    expect(res).toBeTruthy();
  });
  it('purchaseOrders.list returns an array', async () => {
    const res = await client.purchaseOrders.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('purchaseOrders.get returns a record', async () => {
    const res = await client.purchaseOrders.get(1);
    expect(res).toBeTruthy();
  });
  it('purchaseOrderCosts.list returns an array', async () => {
    const res = await client.purchaseOrderCosts.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('purchaseOrderCosts.get returns a record', async () => {
    const res = await client.purchaseOrderCosts.get(1);
    expect(res).toBeTruthy();
  });
  it('purchaseOrderLines.list returns an array', async () => {
    const res = await client.purchaseOrderLines.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('purchaseOrderLines.get returns a record', async () => {
    const res = await client.purchaseOrderLines.get(1);
    expect(res).toBeTruthy();
  });
  it('quotes.list returns an array', async () => {
    const res = await client.quotes.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('quotes.get returns a record', async () => {
    const res = await client.quotes.get(1);
    expect(res).toBeTruthy();
  });
  it('quoteLines.list returns an array', async () => {
    const res = await client.quoteLines.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('quoteLines.get returns a record', async () => {
    const res = await client.quoteLines.get(1);
    expect(res).toBeTruthy();
  });
  it('quoteSections.list returns an array', async () => {
    const res = await client.quoteSections.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('quoteSections.get returns a record', async () => {
    const res = await client.quoteSections.get(1);
    expect(res).toBeTruthy();
  });
  it('salesOrders.list returns an array', async () => {
    const res = await client.salesOrders.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('salesOrders.get returns a record', async () => {
    const res = await client.salesOrders.get(1);
    expect(res).toBeTruthy();
  });
  it('salesOrderLines.list returns an array', async () => {
    const res = await client.salesOrderLines.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('salesOrderLines.get returns a record', async () => {
    const res = await client.salesOrderLines.get(1);
    expect(res).toBeTruthy();
  });
  it('salesOrderPayments.list returns an array', async () => {
    const res = await client.salesOrderPayments.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('salesOrderPayments.get returns a record', async () => {
    const res = await client.salesOrderPayments.get(1);
    expect(res).toBeTruthy();
  });
  it('suppliers.list returns an array', async () => {
    const res = await client.suppliers.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('suppliers.get returns a record', async () => {
    const res = await client.suppliers.get(1);
    expect(res).toBeTruthy();
  });
  it('warehouses.list returns an array', async () => {
    const res = await client.warehouses.list();
    expect(Array.isArray(res)).toBe(true);
  });
  it('warehouses.get returns a record', async () => {
    const res = await client.warehouses.get(1);
    expect(res).toBeTruthy();
  });
});
