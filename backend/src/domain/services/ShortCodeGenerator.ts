import { createHash, randomBytes } from 'node:crypto';
import Hashids from 'hashids';

const BASE62_CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SHORT_CODE_LENGTH = 7;

/**
 * Serviço responsável por gerar códigos curtos únicos para URLs.
 *
 * Estratégia:
 * 1. Gera hash numérico da URL longa
 * 2. Adiciona aleatoriedade para evitar colisões da mesma URL
 * 3. Ofusca com HashID + salt
 * 4. Converte para Base62
 * 5. Extrai 7 caracteres
 */
export class ShortCodeGenerator {
  private readonly hashids: Hashids;
  private readonly salt: string;

  constructor(salt?: string) {
    this.salt = salt || this.generateSalt();
    this.hashids = new Hashids(this.salt, SHORT_CODE_LENGTH);
  }

  /**
   * Gera um código curto único para uma URL.
   * @param longUrl - URL longa a ser encurtada
   * @param attempt - Número da tentativa (para retry em colisão)
   * @returns Código curto de 7 caracteres
   */
  generate(longUrl: string, attempt: number = 0): string {
    // Combina URL + tentativa para garantir unicidade em retries
    const numericHash = this.generateNumericHash(longUrl, attempt);

    // Ofusca usando HashID
    const obfuscated = this.hashids.encode(numericHash);

    // Converte para Base62 e extrai 7 caracteres
    const base62 = this.toBase62(BigInt(numericHash));

    // Garante exatamente 7 caracteres, preenchendo se necessário
    return this.padToLength(base62, SHORT_CODE_LENGTH);
  }

  /**
   * Gera um hash numérico a partir da URL e tentativa.
   * Usa SHA-256 e converte para número.
   */
  private generateNumericHash(longUrl: string, attempt: number): number {
    const combined = `${longUrl}-${attempt}-${Date.now()}-${randomBytes(4).toString('hex')}`;
    const hash = createHash('sha256').update(combined).digest('hex');
    // Pega os primeiros 12 caracteres do hex e converte para número
    // Isso nos dá até 16^12 = 281 trilhões de combinações
    return parseInt(hash.substring(0, 12), 16);
  }

  /**
   * Converte um número para Base62.
   */
  private toBase62(num: bigint): string {
    if (num === 0n) return BASE62_CHARSET[0]!;

    const base = BigInt(62);
    let result = '';
    let n = num;

    while (n > 0n) {
      result = BASE62_CHARSET[Number(n % base)] + result;
      n = n / base;
    }

    return result;
  }

  /**
   * Garante que o código tenha exatamente o comprimento especificado.
   * Se for maior, trunca. Se for menor, preenche com caracteres aleatórios.
   */
  private padToLength(code: string, length: number): string {
    if (code.length >= length) {
      return code.substring(0, length);
    }

    // Preenche com caracteres aleatórios do charset
    const paddingLength = length - code.length;
    let padding = '';
    for (let i = 0; i < paddingLength; i++) {
      const randomIndex = Math.floor(Math.random() * BASE62_CHARSET.length);
      padding += BASE62_CHARSET[randomIndex];
    }

    return code + padding;
  }

  /**
   * Gera um salt aleatório para ofuscação.
   */
  private generateSalt(): string {
    return randomBytes(16).toString('hex');
  }

  /**
   * Valida se um código curto está no formato correto.
   */
  static isValidShortCode(code: string): boolean {
    return (
      code.length === SHORT_CODE_LENGTH &&
      /^[0-9a-zA-Z]+$/.test(code)
    );
  }
}
