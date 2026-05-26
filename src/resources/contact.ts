import type { HttpClient } from '../http.js';
import type { ContactModel, ContactListParams } from '../types/index.js';

export class ContactResource {
  constructor(private readonly http: HttpClient) {}

  /** List Contact records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: ContactListParams): Promise<ContactModel[]> {
    return this.http.request<ContactModel[]>('/v1/contact', { params: params as Record<string, unknown> });
  }

  /** Get a single Contact by ID. */
  async get(id: number): Promise<ContactModel> {
    return this.http.request<ContactModel>(`/v1/contact/${id}`);
  }
}
