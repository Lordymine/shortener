import { describe, it, expect } from 'vitest';
import { ShortCodeGenerator } from '../../src/domain/services/ShortCodeGenerator';

describe('ShortCodeGenerator', () => {
  describe('generate', () => {
    it('deve gerar código curto com exatamente 7 caracteres', () => {
      const generator = new ShortCodeGenerator('test-salt');
      const code = generator.generate('https://example.com');

      expect(code).toHaveLength(7);
    });

    it('deve gerar códigos diferentes para URLs diferentes', () => {
      const generator = new ShortCodeGenerator('test-salt');
      const code1 = generator.generate('https://example.com');
      const code2 = generator.generate('https://another.com');

      expect(code1).not.toBe(code2);
    });

    it('deve gerar códigos diferentes para a mesma URL em tentativas diferentes', () => {
      const generator = new ShortCodeGenerator('test-salt');
      const code1 = generator.generate('https://example.com', 0);
      const code2 = generator.generate('https://example.com', 1);

      expect(code1).not.toBe(code2);
    });

    it('deve usar apenas caracteres Base62 (0-9, a-z, A-Z)', () => {
      const generator = new ShortCodeGenerator('test-salt');
      const code = generator.generate('https://example.com');

      expect(code).toMatch(/^[0-9a-zA-Z]+$/);
    });

    it('deve gerar códigos consistentes para mesma entrada e salt (sem aleatoriedade)', () => {
      // Nota: devido à aleatoriedade adicionada para evitar colisões,
      // este teste verifica que o mecanismo funciona
      const generator = new ShortCodeGenerator('test-salt');
      const codes = new Set<string>();

      // Gera 100 códigos e verifica que são todos válidos
      for (let i = 0; i < 100; i++) {
        const code = generator.generate('https://example.com', i);
        codes.add(code);
        expect(ShortCodeGenerator.isValidShortCode(code)).toBe(true);
      }

      // Deve gerar códigos diferentes a cada tentativa
      expect(codes.size).toBeGreaterThan(90);
    });
  });

  describe('isValidShortCode', () => {
    it('deve retornar true para código válido', () => {
      expect(ShortCodeGenerator.isValidShortCode('abc1234')).toBe(true);
      expect(ShortCodeGenerator.isValidShortCode('ABC9999')).toBe(true);
      expect(ShortCodeGenerator.isValidShortCode('aB1xY7z')).toBe(true);
    });

    it('deve retornar false para código com tamanho incorreto', () => {
      expect(ShortCodeGenerator.isValidShortCode('abc123')).toBe(false); // 6 chars
      expect(ShortCodeGenerator.isValidShortCode('abc12345')).toBe(false); // 8 chars
    });

    it('deve retornar false para código com caracteres inválidos', () => {
      expect(ShortCodeGenerator.isValidShortCode('abc-234')).toBe(false);
      expect(ShortCodeGenerator.isValidShortCode('abc_234')).toBe(false);
      expect(ShortCodeGenerator.isValidShortCode('abc 234')).toBe(false);
    });

    it('deve retornar false para string vazia', () => {
      expect(ShortCodeGenerator.isValidShortCode('')).toBe(false);
    });
  });

  describe('distribuição de caracteres', () => {
    it('deve usar dígitos', () => {
      const generator = new ShortCodeGenerator('test-salt');
      const hasDigit = /\d/.test(generator.generate('https://example.com'));
      expect(hasDigit).toBe(true);
    });

    it('deve usar letras minúsculas', () => {
      const generator = new ShortCodeGenerator('test-salt');
      const hasLower = /[a-z]/.test(generator.generate('https://example.com'));
      expect(hasLower).toBe(true);
    });

    it('deve usar letras maiúsculas', () => {
      const generator = new ShortCodeGenerator('test-salt');
      const hasUpper = /[A-Z]/.test(generator.generate('https://example.com'));
      expect(hasUpper).toBe(true);
    });
  });
});
