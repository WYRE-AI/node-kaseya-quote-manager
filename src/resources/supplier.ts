import type { HttpClient } from '../http.js';
import type { SupplierModel, SupplierListParams } from '../types/index.js';

export class SupplierResource {
  constructor(private readonly http: HttpClient) {}

  /** List Supplier records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: SupplierListParams): Promise<SupplierModel[]> {
    return this.http.request<SupplierModel[]>('/v1/supplier', { params: params as Record<string, unknown> });
  }

  /** Get a single Supplier by ID. */
  async get(id: number): Promise<SupplierModel> {
    return this.http.request<SupplierModel>(`/v1/supplier/${id}`);
  }
}
