import type { HttpClient } from '../http.js';
import type { SalesOrderModel, SalesOrderListParams } from '../types/index.js';

export class SalesOrderResource {
  constructor(private readonly http: HttpClient) {}

  /** List SalesOrder records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: SalesOrderListParams): Promise<SalesOrderModel[]> {
    return this.http.request<SalesOrderModel[]>('/v1/salesorder', { params: params as Record<string, unknown> });
  }

  /** Get a single SalesOrder by ID. */
  async get(id: number): Promise<SalesOrderModel> {
    return this.http.request<SalesOrderModel>(`/v1/salesorder/${id}`);
  }
}
