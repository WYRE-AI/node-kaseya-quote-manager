import type { HttpClient } from '../http.js';
import type { SalesOrderPaymentModel, SalesOrderPaymentListParams } from '../types/index.js';

export class SalesOrderPaymentResource {
  constructor(private readonly http: HttpClient) {}

  /** List SalesOrderPayment records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: SalesOrderPaymentListParams): Promise<SalesOrderPaymentModel[]> {
    return this.http.request<SalesOrderPaymentModel[]>('/v1/salesorderpayment', { params: params as Record<string, unknown> });
  }

  /** Get a single SalesOrderPayment by ID. */
  async get(id: number): Promise<SalesOrderPaymentModel> {
    return this.http.request<SalesOrderPaymentModel>(`/v1/salesorderpayment/${id}`);
  }
}
