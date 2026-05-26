import type { HttpClient } from '../http.js';
import type { WarehouseModel, WarehouseListParams } from '../types/index.js';

export class WarehouseResource {
  constructor(private readonly http: HttpClient) {}

  /** List Warehouse records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: WarehouseListParams): Promise<WarehouseModel[]> {
    return this.http.request<WarehouseModel[]>('/v1/warehouse', { params: params as Record<string, unknown> });
  }

  /** Get a single Warehouse by ID. */
  async get(id: number): Promise<WarehouseModel> {
    return this.http.request<WarehouseModel>(`/v1/warehouse/${id}`);
  }
}
