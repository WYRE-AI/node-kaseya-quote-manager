import type { HttpClient } from '../http.js';
import type { PurchaseOrderLineModel, PurchaseOrderLineListParams } from '../types/index.js';

export class PurchaseOrderLineResource {
  constructor(private readonly http: HttpClient) {}

  /** List PurchaseOrderLine records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: PurchaseOrderLineListParams): Promise<PurchaseOrderLineModel[]> {
    return this.http.request<PurchaseOrderLineModel[]>('/v1/purchaseorderline', { params: params as Record<string, unknown> });
  }

  /** Get a single PurchaseOrderLine by ID. */
  async get(id: number): Promise<PurchaseOrderLineModel> {
    return this.http.request<PurchaseOrderLineModel>(`/v1/purchaseorderline/${id}`);
  }
}
