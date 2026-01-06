import type { IUrlRepository } from '../../domain/repositories/IUrlRepository';
import { ShortCodeGenerator } from '../../domain/services/ShortCodeGenerator';
import { UrlValidator } from '../../domain/validators/UrlValidator';
import type { Url } from '../../domain/entities/Url';
import {
  CreateUrlResponse,
  CollisionError,
  InvalidUrlError,
  ValidationException,
} from '../dtos';

const MAX_COLLISION_RETRIES = 5;

/**
 * Caso de uso para criação de URL curta.
 *
 * Fluxo:
 * 1. Valida URL de entrada
 * 2. Verifica se URL já existe (opcional - reuso)
 * 3. Gera código curto único
 * 4. Persiste no banco
 * 5. Retry em caso de colisão
 */
export class CreateShortUrlUseCase {
  constructor(
    private readonly urlRepository: IUrlRepository,
    private readonly shortCodeGenerator: ShortCodeGenerator,
    private readonly baseUrl: string
  ) {}

  /**
   * Executa o caso de uso.
   * @param input URL longa a ser encurtada
   * @returns URL criada com código curto
   * @throws ValidationException para dados inválidos
   * @throws InvalidUrlError para URL malformada
   */
  async execute(input: { url: string }): Promise<CreateUrlResponse> {
    // Sanitiza e valida a URL
    const sanitizedUrl = UrlValidator.sanitizeUrl(input.url);
    const validationResult = UrlValidator.safeValidateCreateUrl({ url: sanitizedUrl });

    if (!validationResult.success) {
      throw new InvalidUrlError(validationResult.error);
    }

    const longUrl = validationResult.data.url;

    // Verifica se já existe URL encurtada para esta URL longa (reuso)
    const existing = await this.urlRepository.findByLongUrl(longUrl);
    if (existing) {
      return this.buildResponse(existing);
    }

    // Tenta criar com retry em caso de colisão
    return await this.tryCreate(longUrl);
  }

  /**
   * Tenta criar URL com retry em colisões.
   */
  private async tryCreate(longUrl: string, attempt: number = 0): Promise<CreateUrlResponse> {
    if (attempt >= MAX_COLLISION_RETRIES) {
      throw new Error('Failed to generate unique short code after maximum retries');
    }

    const shortCode = this.shortCodeGenerator.generate(longUrl, attempt);

    try {
      const url: Url = {
        shortCode,
        longUrl,
      };

      const saved = await this.urlRepository.save(url);
      return this.buildResponse(saved);
    } catch (error) {
      // Verifica se é erro de unicidade (colisão)
      if (this.isUniqueViolationError(error)) {
        // Retry com novo código
        return this.tryCreate(longUrl, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Constrói a resposta do caso de uso.
   */
  private buildResponse(url: Url): CreateUrlResponse {
    return {
      shortCode: url.shortCode,
      shortUrl: `${this.baseUrl}/${url.shortCode}`,
      longUrl: url.longUrl,
    };
  }

  /**
   * Verifica se o erro é de violação de unicidade.
   */
  private isUniqueViolationError(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return (
        message.includes('unique') ||
        message.includes('duplicate') ||
        message.includes('constraint')
      );
    }
    return false;
  }
}
