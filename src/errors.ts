export class KaseyaQuoteManagerError extends Error {
  constructor(message: string, public statusCode: number, public response: unknown, options?: { cause?: unknown }) {
    super(message, options);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthenticationError extends KaseyaQuoteManagerError {
  constructor(message: string, response: unknown) {
    super(message, 401, response);
  }
}

export class ForbiddenError extends KaseyaQuoteManagerError {
  constructor(message: string, response: unknown) {
    super(message, 403, response);
  }
}

export class NotFoundError extends KaseyaQuoteManagerError {
  constructor(message: string, response: unknown) {
    super(message, 404, response);
  }
}

export class ValidationError extends KaseyaQuoteManagerError {
  constructor(message: string, public errors: Array<{ field: string; message: string }>, response: unknown) {
    super(message, 400, response);
  }
}

export class RateLimitError extends KaseyaQuoteManagerError {
  constructor(message: string, public retryAfter: number, response: unknown) {
    super(message, 429, response);
  }
}

export class ServerError extends KaseyaQuoteManagerError {
  constructor(message: string, response: unknown) {
    super(message, 500, response);
  }
}

export class InvalidIdError extends KaseyaQuoteManagerError {
  constructor() {
    super('Invalid id. Use a positive whole-number ID from a list or get call.', 0, undefined);
  }
}

export class ResponseTooLargeError extends KaseyaQuoteManagerError {
  constructor(cap: number, statusCode: number) {
    super(
      `Quote Manager sent a response larger than ${cap} bytes, so it was not read. Ask for a smaller page (pageSize) or narrower filters, or raise maxResponseBytes.`,
      statusCode,
      undefined,
    );
  }
}
