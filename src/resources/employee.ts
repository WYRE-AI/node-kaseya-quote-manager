import type { HttpClient } from '../http.js';
import type { EmployeeModel, EmployeeListParams } from '../types/index.js';

export class EmployeeResource {
  constructor(private readonly http: HttpClient) {}

  /** List Employee records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: EmployeeListParams): Promise<EmployeeModel[]> {
    return this.http.request<EmployeeModel[]>('/v1/employee', { params: params as Record<string, unknown> });
  }

  /** Get a single Employee by ID. */
  async get(id: number): Promise<EmployeeModel> {
    return this.http.request<EmployeeModel>(`/v1/employee/${id}`);
  }
}
