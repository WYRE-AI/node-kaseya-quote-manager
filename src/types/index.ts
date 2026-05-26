// Auto-generated from the Kaseya Quote Manager (Datto Commerce) OpenAPI spec.
// All entities are read-only (list + get).

export interface KaseyaQuoteManagerClientConfig {
  /** API key from Quote Manager → Settings → API. Sent in the `apiKey` header. */
  apiKey: string;
  /** API base URL. Defaults to https://api.kaseyaquotemanager.com */
  baseUrl?: string;
  /** Max automatic retries on 429/5xx. Default 3. */
  maxRetries?: number;
  /** Client-side rate limit (requests/minute). Default 60 (API hard limit). */
  rateLimitPerMinute?: number;
}

/** Common pagination params. Max pageSize is 100. */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface BrandModel {
  id?: number;
  name?: string;
  imageFilename?: string;
  createDate?: string;
  modifiedDate?: string;
}

export interface CategoryModel {
  id?: number;
  parentID?: number;
  name?: string;
  type?: number;
  displayOrder?: number;
  html?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface ContactModel {
  id?: number;
  customerID?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  mobile?: string;
  autoSendInvoice?: boolean;
  inviteDate?: string;
  lastLoginDate?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface CustomerModel {
  id?: number;
  accountNumber?: string;
  name?: string;
  ownerEmployeeID?: number;
  taxNumber?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingCountry?: string;
  billingPostalCode?: string;
  priceGroup?: number;
  hasCreditLimit?: boolean;
  createDate?: string;
  modifiedDate?: string;
}

export interface CustomerAddressModel {
  id?: number;
  customerID?: number;
  contactName?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  deliveryInstruction?: string;
  createDate?: string;
  modifiedDate?: string;
}

export interface EmployeeModel {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  isActive?: boolean;
  visibility?: number;
  lastLoginDate?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface ProductModel {
  id?: number;
  productNumber?: string;
  manufacturerPartNumber?: string;
  type?: number;
  title?: string;
  brandID?: number;
  weight?: number;
  categoryID?: number;
  price?: number;
  retailPrice?: number;
  isHidden?: boolean;
  isActive?: boolean;
  isRecommended?: boolean;
  isSerialized?: boolean;
  isRecurring?: boolean;
  recurringType?: number;
  url?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface ProductImageModel {
  productNumber?: string;
  url?: string;
}

export interface ProductSupplierModel {
  id?: number;
  productID?: number;
  supplierID?: number;
  quantity?: number;
  cost?: number;
  productNumber?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface PurchaseOrderModel {
  id?: number;
  orderNumber?: string;
  reference?: string;
  supplierID?: number;
  warehouseID?: number;
  salesOrderID?: number;
  type?: number;
  status?: number;
  note?: string;
  dueDate?: string;
  billingCompany?: string;
  billingContact?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  billingCountry?: string;
  deliveryCompany?: string;
  deliveryContact?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryPostalCode?: string;
  deliveryCountry?: string;
  deliveryInstruction?: string;
  orderDate?: string;
  receivedDate?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface PurchaseOrderCostModel {
  id?: number;
  purchaseOrderID?: number;
  description?: string;
  amount?: number;
  tax?: number;
  taxRate?: number;
  createdDate?: string;
  modifiedDate?: string;
}

export interface PurchaseOrderLineModel {
  id?: number;
  purchaseOrderID?: number;
  productID?: number;
  title?: string;
  description?: string;
  price?: number;
  tax?: number;
  taxRate?: number;
  landedCost?: number;
  quantity?: number;
  quantityReceived?: number;
  lineNumber?: number;
  serialNumbers?: PurchaseOrderLineSerialNumberModel[];
  createdDate?: string;
  modifiedDate?: string;
}

export interface QuoteModel {
  id?: number;
  salesOrderId?: number;
  code?: string;
  quoteNumber?: string;
  title?: string;
  status?: number;
  privateNote?: string;
  ownerEmployeeID?: number;
  customerID?: number;
  contactName?: string;
  contactEmail?: string;
  deliveryType?: number;
  deliveryCompany?: string;
  deliveryContact?: string;
  deliveryPhone?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryPostalCode?: string;
  deliveryCountry?: string;
  deliveryInstruction?: string;
  deliveryAmount?: number;
  deliveryTax?: number;
  deliveryTaxRate?: number;
  autotaskQuoteID?: number;
  autotaskOpportunityID?: number;
  autotaskOrganizationID?: number;
  expiryDate?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface QuoteLineModel {
  id?: number;
  quoteSectionID?: number;
  lineNumber?: number;
  title?: string;
  description?: string;
  productID?: number;
  productNumber?: string;
  price?: number;
  taxRate?: number;
  tax?: number;
  quantity?: number;
  isOptional?: boolean;
  isSelected?: boolean;
  isQuantityEditable?: boolean;
  isRecurring?: boolean;
  recurringType?: number;
  recurringDuration?: number;
  discountMethod?: number;
  discountValue?: number;
  createdDate?: string;
  modifiedDate?: string;
}

export interface QuoteSectionModel {
  id?: number;
  quoteID?: number;
  type?: number;
  lineNumber?: number;
  isMultiChoice?: boolean;
  isSelected?: boolean;
  title?: string;
}

export interface SalesOrderModel {
  id?: number;
  orderNumber?: string;
  reference?: string;
  ownerEmployeeID?: number;
  customerID?: number;
  contactFirstName?: string;
  contactLastName?: string;
  contactEmail?: string;
  quoteID?: number;
  status?: number;
  fulfillmentStatus?: number;
  entryType?: number;
  notes?: string;
  deliveryCompany?: string;
  deliveryContact?: string;
  deliveryPhone?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryPostalCode?: string;
  deliveryCountry?: string;
  deliveryInstruction?: string;
  deliveryAmount?: number;
  deliveryTaxRate?: number;
  deliveryTax?: number;
  paymentSurchargeAmount?: number;
  paymentSurchargeTaxRate?: number;
  paymentSurchargeTax?: number;
  couponDiscount?: number;
  ipAddress?: string;
  ipAddressCountry?: string;
  orderDate?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface SalesOrderLineModel {
  id?: number;
  salesOrderID?: number;
  productID?: number;
  lineNumber?: number;
  cost?: number;
  price?: number;
  tax?: number;
  taxRate?: number;
  quantity?: number;
  title?: string;
  description?: string;
  unitWeight?: number;
  isRecurring?: boolean;
  recurringType?: number;
  recurringDuration?: number;
  discountMethod?: number;
  discountValue?: number;
  serialNumbers?: SalesOrderLineSerialNumberModel[];
  createdDate?: string;
  modifiedDate?: string;
}

export interface SalesOrderPaymentModel {
  id?: number;
  salesOrderID?: number;
  type?: number;
  amount?: number;
  transactionID?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface SupplierModel {
  id?: number;
  accountNumber?: string;
  name?: string;
  isOnline?: boolean;
  onlineETA?: string;
  email?: string;
  note?: string;
  createDate?: string;
  modifiedDate?: string;
}

export interface WarehouseModel {
  id?: number;
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  createDate?: string;
  modifiedDate?: string;
}

export interface PurchaseOrderLineSerialNumberModel {
  serialNumber?: string;
  status?: string;
  warehouseID?: number;
}

export interface SalesOrderLineSerialNumberModel {
  serialNumber?: string;
  status?: string;
  warehouseID?: number;
}

export interface BrandListParams {
  page?: number;
  pageSize?: number;
  modifiedAfter?: string;
}

export interface CategoryListParams {
}

export interface ContactListParams {
  customerID?: number;
  page?: number;
  pageSize?: number;
  modifiedAfter?: string;
}

export interface CustomerListParams {
  page?: number;
  pageSize?: number;
  modifiedAfter?: string;
}

export interface CustomerAddressListParams {
  customerID?: number;
  page?: number;
  pageSize?: number;
  modifiedAfter?: string;
}

export interface EmployeeListParams {
  page?: number;
  pageSize?: number;
}

export interface ProductListParams {
  manufacturerPartNumber?: string;
  page?: number;
  pageSize?: number;
  modifiedAfter?: string;
}

export interface ProductImageListParams {
  productID?: number;
  page?: number;
  pageSize?: number;
}

export interface ProductSupplierListParams {
  productID?: number;
  page?: number;
  pageSize?: number;
  modifiedAfter?: string;
}

export interface PurchaseOrderListParams {
  orderNumber?: string;
  page?: number;
  pageSize?: number;
  modifiedAfter?: string;
}

export interface PurchaseOrderCostListParams {
  purchaseOrderID?: number;
  page?: number;
  pageSize?: number;
  modifiedAfter?: string;
}

export interface PurchaseOrderLineListParams {
  purchaseOrderID?: number;
  page?: number;
  pageSize?: number;
  modifiedAfter?: string;
}

export interface QuoteListParams {
  quoteNumber?: string;
  page?: number;
  pageSize?: number;
  modifiedAfter?: string;
}

export interface QuoteLineListParams {
  quoteSectionID?: number;
  page?: number;
  pageSize?: number;
}

export interface QuoteSectionListParams {
  quoteID?: number;
  page?: number;
  pageSize?: number;
}

export interface SalesOrderListParams {
  orderNumber?: string;
  page?: number;
  pageSize?: number;
  modifiedAfter?: string;
}

export interface SalesOrderLineListParams {
  salesOrderID?: number;
  page?: number;
  pageSize?: number;
  modifiedAfter?: string;
}

export interface SalesOrderPaymentListParams {
  salesOrderID?: number;
  page?: number;
  pageSize?: number;
  modifiedAfter?: string;
}

export interface SupplierListParams {
  page?: number;
  pageSize?: number;
  modifiedAfter?: string;
}

export interface WarehouseListParams {
  page?: number;
  pageSize?: number;
  modifiedAfter?: string;
}
