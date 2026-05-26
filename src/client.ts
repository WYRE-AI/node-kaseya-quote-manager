import type { KaseyaQuoteManagerClientConfig } from './types/index.js';
import { HttpClient } from './http.js';
import { RateLimiter } from './rate-limiter.js';
import { BrandResource } from './resources/brand.js';
import { CategoryResource } from './resources/category.js';
import { ContactResource } from './resources/contact.js';
import { CustomerResource } from './resources/customer.js';
import { CustomerAddressResource } from './resources/customer-address.js';
import { EmployeeResource } from './resources/employee.js';
import { ProductResource } from './resources/product.js';
import { ProductImageResource } from './resources/product-image.js';
import { ProductSupplierResource } from './resources/product-supplier.js';
import { PurchaseOrderResource } from './resources/purchase-order.js';
import { PurchaseOrderCostResource } from './resources/purchase-order-cost.js';
import { PurchaseOrderLineResource } from './resources/purchase-order-line.js';
import { QuoteResource } from './resources/quote.js';
import { QuoteLineResource } from './resources/quote-line.js';
import { QuoteSectionResource } from './resources/quote-section.js';
import { SalesOrderResource } from './resources/sales-order.js';
import { SalesOrderLineResource } from './resources/sales-order-line.js';
import { SalesOrderPaymentResource } from './resources/sales-order-payment.js';
import { SupplierResource } from './resources/supplier.js';
import { WarehouseResource } from './resources/warehouse.js';

export class KaseyaQuoteManagerClient {
  readonly brands: BrandResource;
  readonly categories: CategoryResource;
  readonly contacts: ContactResource;
  readonly customers: CustomerResource;
  readonly customerAddress: CustomerAddressResource;
  readonly employees: EmployeeResource;
  readonly products: ProductResource;
  readonly productImages: ProductImageResource;
  readonly productSuppliers: ProductSupplierResource;
  readonly purchaseOrders: PurchaseOrderResource;
  readonly purchaseOrderCosts: PurchaseOrderCostResource;
  readonly purchaseOrderLines: PurchaseOrderLineResource;
  readonly quotes: QuoteResource;
  readonly quoteLines: QuoteLineResource;
  readonly quoteSections: QuoteSectionResource;
  readonly salesOrders: SalesOrderResource;
  readonly salesOrderLines: SalesOrderLineResource;
  readonly salesOrderPayments: SalesOrderPaymentResource;
  readonly suppliers: SupplierResource;
  readonly warehouses: WarehouseResource;

  constructor(config: KaseyaQuoteManagerClientConfig) {
    if (!config.apiKey) throw new Error('apiKey is required');
    const rateLimiter = new RateLimiter(config.rateLimitPerMinute ?? 60);
    const http = new HttpClient({
      baseUrl: config.baseUrl ?? 'https://api.kaseyaquotemanager.com',
      apiKey: config.apiKey,
      maxRetries: config.maxRetries ?? 3,
      rateLimiter,
    });

    this.brands = new BrandResource(http);
    this.categories = new CategoryResource(http);
    this.contacts = new ContactResource(http);
    this.customers = new CustomerResource(http);
    this.customerAddress = new CustomerAddressResource(http);
    this.employees = new EmployeeResource(http);
    this.products = new ProductResource(http);
    this.productImages = new ProductImageResource(http);
    this.productSuppliers = new ProductSupplierResource(http);
    this.purchaseOrders = new PurchaseOrderResource(http);
    this.purchaseOrderCosts = new PurchaseOrderCostResource(http);
    this.purchaseOrderLines = new PurchaseOrderLineResource(http);
    this.quotes = new QuoteResource(http);
    this.quoteLines = new QuoteLineResource(http);
    this.quoteSections = new QuoteSectionResource(http);
    this.salesOrders = new SalesOrderResource(http);
    this.salesOrderLines = new SalesOrderLineResource(http);
    this.salesOrderPayments = new SalesOrderPaymentResource(http);
    this.suppliers = new SupplierResource(http);
    this.warehouses = new WarehouseResource(http);
  }
}
