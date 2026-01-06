import { describe, it, expect, beforeEach } from 'vitest';
import { CreateShortUrlUseCase } from '../../src/application/use-cases/CreateShortUrl';
import { ShortCodeGenerator } from '../../src/domain/services/ShortCodeGenerator';
import { MockUrlRepository } from '../mocks/UrlRepository.mock';
import { InvalidUrlError } from '../../src/application/dtos';

describe('CreateShortUrlUseCase', () => {
  let useCase: CreateShortUrlUseCase;
  let repository: MockUrlRepository;
  let generator: ShortCodeGenerator;

  beforeEach(() => {
    repository = new MockUrlRepository();
    generator = new ShortCodeGenerator('test-salt');
    useCase = new CreateShortUrlUseCase(repository, generator, 'https://short.est');
  });

  describe('execute', () => {
    it('deve criar URL curta com sucesso', async () => {
      const result = await useCase.execute({ url: 'https://example.com' });

      expect(result.shortCode).toHaveLength(7);
      expect(result.longUrl).toBe('https://example.com');
      expect(result.shortUrl).toMatch(/^https:\/\/short\.est\/[0-9a-zA-Z]{7}$/);
    });

    it('deve reusar URL existente para mesma URL longa', async () => {
      const result1 = await useCase.execute({ url: 'https://example.com' });
      const result2 = await useCase.execute({ url: 'https://example.com' });

      expect(result1.shortCode).toBe(result2.shortCode);
      expect(result1.longUrl).toBe(result2.longUrl);
    });

    it('deve rejeitar URL vazia', async () => {
      await expect(useCase.execute({ url: '' })).rejects.toThrow(InvalidUrlError);
    });

    it('deve rejeitar URL sem protocolo', async () => {
      await expect(useCase.execute({ url: 'example.com' })).rejects.toThrow(InvalidUrlError);
    });

    it('deve rejeitar protocolo javascript:', async () => {
      await expect(
        useCase.execute({ url: 'javascript:alert(1)' })
      ).rejects.toThrow(InvalidUrlError);
    });

    it('deve rejeitar protocolo data:', async () => {
      await expect(
        useCase.execute({ url: 'data:text/html,<script>' })
      ).rejects.toThrow(InvalidUrlError);
    });

    it('deve sanitizar URL removendo espaços', async () => {
      const result = await useCase.execute({ url: '  https://example.com  ' });

      expect(result.longUrl).toBe('https://example.com');
    });

    it('deve gerar códigos diferentes para URLs diferentes', async () => {
      const result1 = await useCase.execute({ url: 'https://example.com' });
      const result2 = await useCase.execute({ url: 'https://another.com' });

      expect(result1.shortCode).not.toBe(result2.shortCode);
    });

    it('deve lidar com colisões retryando com novo código', async () => {
      let callCount = 0;
      const originalSave = repository.save.bind(repository);

      // Mock que simula colisão nas primeiras 2 tentativas
      repository.save = async function (url) {
        callCount++;
        if (callCount <= 2) {
          // Simula colisão inserindo antes
          await originalSave({ ...url, shortCode: url.shortCode + 'x' });
          const error = new Error('Unique constraint violation');
          (error as any).code = 'P2002';
          throw error;
        }
        return originalSave(url);
      };

      const result = await useCase.execute({ url: 'https://example.com' });

      expect(result.shortCode).toHaveLength(7);
      expect(callCount).toBeGreaterThan(2);
    });
  });

  describe('baseUrl', () => {
    it('deve usar baseUrl configurado na resposta', async () => {
      useCase = new CreateShortUrlUseCase(repository, generator, 'https://my.link');

      const result = await useCase.execute({ url: 'https://example.com' });

      expect(result.shortUrl).toMatch(/^https:\/\/my\.link\//);
    });
  });
});
