import type { HttpClient } from '../http.js';
import type { ProductSupplierModel, ProductSupplierListParams } from '../types/index.js';

export class ProductSupplierResource {
  constructor(private readonly http: HttpClient) {}

  /** List ProductSupplier records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: ProductSupplierListParams): Promise<ProductSupplierModel[]> {
    return this.http.request<ProductSupplierModel[]>('/v1/productsupplier', { params: params as Record<string, unknown> });
  }

  /** Get a single ProductSupplier by ID. */
  async get(id: number): Promise<ProductSupplierModel> {
    return this.http.request<ProductSupplierModel>(`/v1/productsupplier/${id}`);
  }
}
