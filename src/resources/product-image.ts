import type { HttpClient } from '../http.js';
import type { ProductImageModel, ProductImageListParams } from '../types/index.js';

export class ProductImageResource {
  constructor(private readonly http: HttpClient) {}

  /** List ProductImage records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: ProductImageListParams): Promise<ProductImageModel[]> {
    return this.http.request<ProductImageModel[]>('/v1/productimage', { params: params as Record<string, unknown> });
  }
}
