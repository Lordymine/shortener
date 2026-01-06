import type { IUrlRepository } from '../../domain/repositories/IUrlRepository';
import { ShortCodeGenerator } from '../../domain/services/ShortCodeGenerator';
import type { Url } from '../../domain/entities/Url';
import { GetUrlResponse, UrlNotFoundError, InvalidUrlError } from '../dtos';

/**
 * Caso de uso para recuperação de URL original a partir do código curto.
 *
 * Fluxo:
 * 1. Valida o código curto
 * 2. Busca no repositório
 * 3. Retorna URL original ou erro
 */
export class GetOriginalUrlUseCase {
  constructor(private readonly urlRepository: IUrlRepository) {}

  /**
   * Executa o caso de uso.
   * @param shortCode Código curto da URL
   * @returns URL original com metadados
   * @throws InvalidUrlError para código inválido
   * @throws UrlNotFoundError quando código não existe
   */
  async execute(shortCode: string): Promise<GetUrlResponse> {
    // Valida o formato do código curto
    if (!ShortCodeGenerator.isValidShortCode(shortCode)) {
      throw new InvalidUrlError('Invalid short code format');
    }

    // Busca a URL no repositório
    const url = await this.urlRepository.findByShortCode(shortCode);

    if (!url) {
      throw new UrlNotFoundError(shortCode);
    }

    return this.buildResponse(url);
  }

  /**
   * Constrói a resposta do caso de uso.
   */
  private buildResponse(url: Url): GetUrlResponse {
    return {
      shortCode: url.shortCode,
      longUrl: url.longUrl,
      createdAt: url.createdAt ?? new Date(),
    };
  }

  /**
   * Método auxiliar para buscar apenas a URL longa (para redirecionamento)
   */
  async getLongUrl(shortCode: string): Promise<string> {
    const result = await this.execute(shortCode);
    return result.longUrl;
  }
}
