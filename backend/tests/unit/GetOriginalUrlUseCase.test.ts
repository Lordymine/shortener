import { describe, it, expect, beforeEach } from 'vitest';
import { GetOriginalUrlUseCase } from '../../src/application/use-cases/GetOriginalUrl';
import { MockUrlRepository } from '../mocks/UrlRepository.mock';
import { UrlNotFoundError, InvalidUrlError } from '../../src/application/dtos';
import type { Url } from '../../src/domain/entities/Url';

describe('GetOriginalUrlUseCase', () => {
  let useCase: GetOriginalUrlUseCase;
  let repository: MockUrlRepository;

  beforeEach(() => {
    repository = new MockUrlRepository();
    useCase = new GetOriginalUrlUseCase(repository);
  });

  describe('execute', () => {
    it('deve retornar URL original quando código existe', async () => {
      const mockUrl: Url = {
        id: 1n,
        shortCode: 'abc1234',
        longUrl: 'https://example.com',
        createdAt: new Date('2024-01-01'),
      };

      // @ts-ignore - bypass private for test
      repository.urls.set('abc1234', mockUrl);

      const result = await useCase.execute('abc1234');

      expect(result.shortCode).toBe('abc1234');
      expect(result.longUrl).toBe('https://example.com');
      expect(result.createdAt).toEqual(new Date('2024-01-01'));
    });

    it('deve lançar UrlNotFoundError quando código não existe', async () => {
      await expect(useCase.execute('xyz9999')).rejects.toThrow(UrlNotFoundError);
      await expect(useCase.execute('xyz9999')).rejects.toThrow('xyz9999');
    });

    it('deve rejeitar código com formato inválido - menos de 7 caracteres', async () => {
      await expect(useCase.execute('abc123')).rejects.toThrow();
    });

    it('deve rejeitar código com formato inválido - mais de 7 caracteres', async () => {
      await expect(useCase.execute('abc12345')).rejects.toThrow();
    });

    it('deve rejeitar código com caracteres especiais', async () => {
      await expect(useCase.execute('abc-123')).rejects.toThrow();
    });
  });

  describe('getLongUrl', () => {
    it('deve retornar apenas a URL longa', async () => {
      const mockUrl: Url = {
        id: 1n,
        shortCode: 'abc1234',
        longUrl: 'https://example.com/path',
        createdAt: new Date(),
      };

      // @ts-ignore
      repository.urls.set('abc1234', mockUrl);

      const longUrl = await useCase.getLongUrl('abc1234');

      expect(longUrl).toBe('https://example.com/path');
    });

    it('deve lançar erro quando código não existe', async () => {
      await expect(useCase.getLongUrl('xyz9999')).rejects.toThrow(UrlNotFoundError);
    });
  });
});
