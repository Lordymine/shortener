import type { Url } from '../entities/Url';

/**
 * Interface do repositório de URLs.
 * Define o contrato para operações de persistência.
 */
export interface IUrlRepository {
  /**
   * Salva uma nova URL no banco de dados.
   * @throws Error se o short_code já existir (colisão)
   */
  save(url: Url): Promise<Url>;

  /**
   * Busca uma URL pelo código curto.
   * @returns A URL encontrada ou null
   */
  findByShortCode(shortCode: string): Promise<Url | null>;

  /**
   * Verifica se um código curto já existe.
   */
  existsByShortCode(shortCode: string): Promise<boolean>;

  /**
   * Busca uma URL longa existente.
   * Útil para evitar duplicatas.
   */
  findByLongUrl(longUrl: string): Promise<Url | null>;
}
