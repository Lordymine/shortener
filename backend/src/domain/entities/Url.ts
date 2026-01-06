/**
 * Entidade Url representa uma URL encurtada no domínio.
 */
export interface Url {
  id?: bigint;
  shortCode: string;
  longUrl: string;
  createdAt?: Date;
}

/**
 * DTO para criação de uma nova URL
 */
export interface CreateUrlDto {
  longUrl: string;
}

/**
 * DTO para resultado de criação de URL
 */
export interface CreatedUrlDto {
  shortCode: string;
  longUrl: string;
  shortUrl: string;
}
