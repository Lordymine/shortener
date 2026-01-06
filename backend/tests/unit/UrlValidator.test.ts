import { describe, it, expect } from 'vitest';
import { UrlValidator } from '../../src/domain/validators/UrlValidator';

describe('UrlValidator', () => {
  describe('validateCreateUrl', () => {
    it('deve aceitar URL HTTP válida', () => {
      const result = UrlValidator.validateCreateUrl({ url: 'http://example.com' });
      expect(result.url).toBe('http://example.com');
    });

    it('deve aceitar URL HTTPS válida', () => {
      const result = UrlValidator.validateCreateUrl({ url: 'https://example.com' });
      expect(result.url).toBe('https://example.com');
    });

    it('deve aceitar URL com path e query params', () => {
      const result = UrlValidator.validateCreateUrl({
        url: 'https://example.com/path/to/page?param=value&other=123',
      });
      expect(result.url).toBe('https://example.com/path/to/page?param=value&other=123');
    });

    it('deve lançar erro para URL vazia', () => {
      expect(() => UrlValidator.validateCreateUrl({ url: '' })).toThrow('URL é obrigatória');
    });

    it('deve lançar erro para URL sem protocolo', () => {
      expect(() => UrlValidator.validateCreateUrl({ url: 'example.com' })).toThrow();
    });

    it('deve lançar erro para protocolo javascript:', () => {
      expect(() =>
        UrlValidator.validateCreateUrl({ url: 'javascript:alert(1)' })
      ).toThrow('Protocolo não permitido');
    });

    it('deve lançar erro para protocolo data:', () => {
      expect(() => UrlValidator.validateCreateUrl({ url: 'data:text/html,<script>' })).toThrow(
        'Protocolo não permitido'
      );
    });

    it('deve lançar erro para protocolo ftp:', () => {
      expect(() => UrlValidator.validateCreateUrl({ url: 'ftp://example.com' })).toThrow();
    });

    it('deve lançar erro para URL muito longa', () => {
      const longUrl = 'https://example.com/' + 'x'.repeat(2048);
      expect(() => UrlValidator.validateCreateUrl({ url: longUrl })).toThrow(
        'URL muito longa'
      );
    });

    it('deve lançar erro para URL malformada', () => {
      expect(() => UrlValidator.validateCreateUrl({ url: 'not a url' })).toThrow();
    });
  });

  describe('validateShortCode', () => {
    it('deve aceitar código curto válido', () => {
      const result = UrlValidator.validateShortCode('abc1234');
      expect(result).toBe('abc1234');
    });

    it('deve aceitar código com maiúsculas e minúsculas', () => {
      const result = UrlValidator.validateShortCode('AbC123X');
      expect(result).toBe('AbC123X');
    });

    it('deve lançar erro para código com menos de 7 caracteres', () => {
      expect(() => UrlValidator.validateShortCode('abc123')).toThrow('7 caracteres');
    });

    it('deve lançar erro para código com mais de 7 caracteres', () => {
      expect(() => UrlValidator.validateShortCode('abc12345')).toThrow('7 caracteres');
    });

    it('deve lançar erro para código com caracteres especiais', () => {
      expect(() => UrlValidator.validateShortCode('abc-234')).toThrow('inválido');
    });

    it('deve lançar erro para string vazia', () => {
      expect(() => UrlValidator.validateShortCode('')).toThrow();
    });
  });

  describe('safeValidateCreateUrl', () => {
    it('deve retornar sucesso para URL válida', () => {
      const result = UrlValidator.safeValidateCreateUrl({ url: 'https://example.com' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.url).toBe('https://example.com');
      }
    });

    it('deve retornar erro para URL inválida sem lançar exceção', () => {
      const result = UrlValidator.safeValidateCreateUrl({ url: 'not-a-url' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeTruthy();
      }
    });
  });

  describe('sanitizeUrl', () => {
    it('deve remover espaços', () => {
      const result = UrlValidator.sanitizeUrl('  https://example.com  ');
      expect(result).toBe('https://example.com');
    });

    it('deve remover espaços internos', () => {
      const result = UrlValidator.sanitizeUrl('https://example.com/path with spaces');
      expect(result).toBe('https://example.com/pathwithspaces');
    });

    it('deve preservar URL válida', () => {
      const result = UrlValidator.sanitizeUrl('https://example.com/path');
      expect(result).toBe('https://example.com/path');
    });
  });
});
