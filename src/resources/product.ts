import type { HttpClient } from '../http.js';
import type { ProductModel, ProductListParams } from '../types/index.js';

export class ProductResource {
  constructor(private readonly http: HttpClient) {}

  /** List Product records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: ProductListParams): Promise<ProductModel[]> {
    return this.http.request<ProductModel[]>('/v1/product', { params: params as Record<string, unknown> });
  }

  /** Get a single Product by ID. */
  async get(id: number): Promise<ProductModel> {
    return this.http.request<ProductModel>(`/v1/product/${id}`);
  }
}
