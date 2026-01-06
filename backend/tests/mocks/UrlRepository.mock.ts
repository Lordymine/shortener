import type { IUrlRepository } from '../../src/domain/repositories/IUrlRepository';
import type { Url } from '../../src/domain/entities/Url';

/**
 * Mock do repositório de URLs para testes.
 */
export class MockUrlRepository implements IUrlRepository {
  private urls: Map<string, Url> = new Map();
  private nextId: bigint = 1n;

  async save(url: Url): Promise<Url> {
    // Verifica duplicata
    if (this.urls.has(url.shortCode)) {
      const error = new Error('Unique constraint violation');
      (error as any).code = 'P2002';
      throw error;
    }

    const saved: Url = {
      ...url,
      id: this.nextId++,
      createdAt: url.createdAt ?? new Date(),
    };

    this.urls.set(url.shortCode, saved);
    return saved;
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    return this.urls.get(shortCode) ?? null;
  }

  async existsByShortCode(shortCode: string): Promise<boolean> {
    return this.urls.has(shortCode);
  }

  async findByLongUrl(longUrl: string): Promise<Url | null> {
    for (const url of this.urls.values()) {
      if (url.longUrl === longUrl) {
        return url;
      }
    }
    return null;
  }

  /**
   * Limpa o repositório (para testes)
   */
  clear(): void {
    this.urls.clear();
    this.nextId = 1n;
  }

  /**
   * Retorna todas as URLs (para testes)
   */
  getAll(): Url[] {
    return Array.from(this.urls.values());
  }
}
