import type { HttpClient } from '../http.js';
import type { PurchaseOrderCostModel, PurchaseOrderCostListParams } from '../types/index.js';

export class PurchaseOrderCostResource {
  constructor(private readonly http: HttpClient) {}

  /** List PurchaseOrderCost records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: PurchaseOrderCostListParams): Promise<PurchaseOrderCostModel[]> {
    return this.http.request<PurchaseOrderCostModel[]>('/v1/purchaseordercost', { params: params as Record<string, unknown> });
  }

  /** Get a single PurchaseOrderCost by ID. */
  async get(id: number): Promise<PurchaseOrderCostModel> {
    return this.http.request<PurchaseOrderCostModel>(`/v1/purchaseordercost/${id}`);
  }
}
