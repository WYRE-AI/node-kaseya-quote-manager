import type { HttpClient } from '../http.js';
import type { QuoteModel, QuoteListParams } from '../types/index.js';

export class QuoteResource {
  constructor(private readonly http: HttpClient) {}

  /** List Quote records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: QuoteListParams): Promise<QuoteModel[]> {
    return this.http.request<QuoteModel[]>('/v1/quote', { params: params as Record<string, unknown> });
  }

  /** Get a single Quote by ID. */
  async get(id: number): Promise<QuoteModel> {
    return this.http.request<QuoteModel>(`/v1/quote/${id}`);
  }
}
