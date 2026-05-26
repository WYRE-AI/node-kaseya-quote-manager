import type { HttpClient } from '../http.js';
import type { CustomerModel, CustomerListParams } from '../types/index.js';

export class CustomerResource {
  constructor(private readonly http: HttpClient) {}

  /** List Customer records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: CustomerListParams): Promise<CustomerModel[]> {
    return this.http.request<CustomerModel[]>('/v1/customer', { params: params as Record<string, unknown> });
  }

  /** Get a single Customer by ID. */
  async get(id: number): Promise<CustomerModel> {
    return this.http.request<CustomerModel>(`/v1/customer/${id}`);
  }
}
