import type { HttpClient } from '../http.js';
import type { SalesOrderLineModel, SalesOrderLineListParams } from '../types/index.js';

export class SalesOrderLineResource {
  constructor(private readonly http: HttpClient) {}

  /** List SalesOrderLine records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: SalesOrderLineListParams): Promise<SalesOrderLineModel[]> {
    return this.http.request<SalesOrderLineModel[]>('/v1/salesorderline', { params: params as Record<string, unknown> });
  }

  /** Get a single SalesOrderLine by ID. */
  async get(id: number): Promise<SalesOrderLineModel> {
    return this.http.request<SalesOrderLineModel>(`/v1/salesorderline/${id}`);
  }
}
