import { z } from 'zod';

/**
 * Protocolos perigosos que não devem ser aceitos
 */
const DANGEROUS_PROTOCOLS = [
  'javascript:',
  'data:',
  'vbscript:',
  'file:',
  'ftp:',
];

/**
 * Schema de validação para criação de URL curta
 */
export const createUrlSchema = z.object({
  url: z
    .string()
    .min(1, 'URL é obrigatória')
    .max(2048, 'URL muito longa (máximo 2048 caracteres)')
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          // Verifica protocolo permitido
          return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
          return false;
        }
      },
      { message: 'URL inválida. Use http:// ou https://' }
    )
    .refine(
      (url) => {
        return !DANGEROUS_PROTOCOLS.some((protocol) =>
          url.toLowerCase().startsWith(protocol)
        );
      },
      { message: 'Protocolo não permitido' }
    ),
});

export type CreateUrlInput = z.infer<typeof createUrlSchema>;

/**
 * Schema de validação para short code
 */
export const shortCodeSchema = z
  .string()
  .length(7, 'Código curto deve ter 7 caracteres')
  .regex(/^[0-9a-zA-Z]+$/, 'Código curto inválido');

export type ShortCodeInput = z.infer<typeof shortCodeSchema>;

/**
 * Validador de URLs
 */
export class UrlValidator {
  /**
   * Valida dados de entrada para criação de URL
   */
  static validateCreateUrl(input: unknown): CreateUrlInput {
    return createUrlSchema.parse(input);
  }

  /**
   * Valida um código curto
   */
  static validateShortCode(input: unknown): ShortCodeInput {
    return shortCodeSchema.parse(input);
  }

  /**
   * Valida sem lançar erro (retorna resultado)
   */
  static safeValidateCreateUrl(
    input: unknown
  ): { success: true; data: CreateUrlInput } | { success: false; error: string } {
    const result = createUrlSchema.safeParse(input);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return {
      success: false,
      error: result.error.errors.map((e) => e.message).join(', '),
    };
  }

  /**
   * Sanitiza URL removendo espaços e normalizando
   */
  static sanitizeUrl(url: string): string {
    return url.trim().replace(/\s+/g, '');
  }
}
