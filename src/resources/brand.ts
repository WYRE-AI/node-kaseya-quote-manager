import type { HttpClient } from '../http.js';
import type { BrandModel, BrandListParams } from '../types/index.js';

export class BrandResource {
  constructor(private readonly http: HttpClient) {}

  /** List Brand records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: BrandListParams): Promise<BrandModel[]> {
    return this.http.request<BrandModel[]>('/v1/brand', { params: params as Record<string, unknown> });
  }

  /** Get a single Brand by ID. */
  async get(id: number): Promise<BrandModel> {
    return this.http.request<BrandModel>(`/v1/brand/${id}`);
  }
}
