import type { HttpClient } from '../http.js';
import type { QuoteSectionModel, QuoteSectionListParams } from '../types/index.js';

export class QuoteSectionResource {
  constructor(private readonly http: HttpClient) {}

  /** List QuoteSection records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: QuoteSectionListParams): Promise<QuoteSectionModel[]> {
    return this.http.request<QuoteSectionModel[]>('/v1/quotesection', { params: params as Record<string, unknown> });
  }

  /** Get a single QuoteSection by ID. */
  async get(id: number): Promise<QuoteSectionModel> {
    return this.http.request<QuoteSectionModel>(`/v1/quotesection/${id}`);
  }
}
