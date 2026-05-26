import type { HttpClient } from '../http.js';
import type { PurchaseOrderModel, PurchaseOrderListParams } from '../types/index.js';

export class PurchaseOrderResource {
  constructor(private readonly http: HttpClient) {}

  /** List PurchaseOrder records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: PurchaseOrderListParams): Promise<PurchaseOrderModel[]> {
    return this.http.request<PurchaseOrderModel[]>('/v1/purchaseorder', { params: params as Record<string, unknown> });
  }

  /** Get a single PurchaseOrder by ID. */
  async get(id: number): Promise<PurchaseOrderModel> {
    return this.http.request<PurchaseOrderModel>(`/v1/purchaseorder/${id}`);
  }
}
