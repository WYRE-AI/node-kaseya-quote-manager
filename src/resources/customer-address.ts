import type { HttpClient } from '../http.js';
import type { CustomerAddressModel, CustomerAddressListParams } from '../types/index.js';

export class CustomerAddressResource {
  constructor(private readonly http: HttpClient) {}

  /** List CustomerAddress records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: CustomerAddressListParams): Promise<CustomerAddressModel[]> {
    return this.http.request<CustomerAddressModel[]>('/v1/customeraddress', { params: params as Record<string, unknown> });
  }

  /** Get a single CustomerAddress by ID. */
  async get(id: number): Promise<CustomerAddressModel> {
    return this.http.request<CustomerAddressModel>(`/v1/customeraddress/${id}`);
  }
}
