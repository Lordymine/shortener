import { z } from 'zod';

// ============================================================================
// REQUEST DTOs
// ============================================================================

/**
 * Schema de entrada para criação de URL curta
 */
export const createUrlRequestSchema = z.object({
  url: z.string().min(1).max(2048),
});

export type CreateUrlRequest = z.infer<typeof createUrlRequestSchema>;

// ============================================================================
// RESPONSE DTOs
// ============================================================================

/**
 * Resposta de sucesso para criação de URL
 */
export interface CreateUrlResponse {
  shortCode: string;
  shortUrl: string;
  longUrl: string;
}

/**
 * Resposta para consulta de URL original
 */
export interface GetUrlResponse {
  shortCode: string;
  longUrl: string;
  createdAt: Date;
}

// ============================================================================
// ERRORS
// ============================================================================

/**
 * Erro de campo na validação
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Erro de colisão de short code (para retry)
 */
export class CollisionError extends Error {
  constructor(public readonly shortCode: string) {
    super(`Collision detected for short code: ${shortCode}`);
    this.name = 'CollisionError';
  }
}

/**
 * Erro de validação de entrada
 */
export class ValidationException extends Error {
  constructor(public readonly errors: FieldError[]) {
    super('Validation failed');
    this.name = 'ValidationException';
  }
}

/**
 * Erro de URL não encontrada
 */
export class UrlNotFoundError extends Error {
  constructor(public readonly shortCode: string) {
    super(`URL not found for short code: ${shortCode}`);
    this.name = 'UrlNotFoundError';
  }
}

/**
 * Erro de URL inválida
 */
export class InvalidUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUrlError';
  }
}
