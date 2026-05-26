import type { HttpClient } from '../http.js';
import type { QuoteLineModel, QuoteLineListParams } from '../types/index.js';

export class QuoteLineResource {
  constructor(private readonly http: HttpClient) {}

  /** List QuoteLine records. Returns up to `pageSize` (max 100) results per page. */
  async list(params?: QuoteLineListParams): Promise<QuoteLineModel[]> {
    return this.http.request<QuoteLineModel[]>('/v1/quoteline', { params: params as Record<string, unknown> });
  }

  /** Get a single QuoteLine by ID. */
  async get(id: number): Promise<QuoteLineModel> {
    return this.http.request<QuoteLineModel>(`/v1/quoteline/${id}`);
  }
}
