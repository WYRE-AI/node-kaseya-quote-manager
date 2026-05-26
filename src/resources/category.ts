import type { HttpClient } from '../http.js';
import type { CategoryModel, CategoryListParams } from '../types/index.js';

export class CategoryResource {
  constructor(private readonly http: HttpClient) {}

  /** List Category records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: CategoryListParams): Promise<CategoryModel[]> {
    return this.http.request<CategoryModel[]>('/v1/category', { params: params as Record<string, unknown> });
  }

  /** Get a single Category by ID. */
  async get(id: number): Promise<CategoryModel> {
    return this.http.request<CategoryModel>(`/v1/category/${id}`);
  }
}
