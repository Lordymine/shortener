import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from '../../src/server';
import type { FastifyInstance } from 'fastify';
import { prisma } from '../../src/infrastructure/database/prisma';

describe('Integração: Rotas de URL', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = await createServer();
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
    await prisma.$disconnect();
  });

  describe('POST /shorten', () => {
    it('deve criar URL curta com sucesso', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/shorten',
        payload: { url: 'https://example.com' },
      });

      expect(response.statusCode).toBe(201);

      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('shortCode');
      expect(body).toHaveProperty('shortUrl');
      expect(body).toHaveProperty('longUrl', 'https://example.com');
      expect(body.shortCode).toHaveLength(7);
      expect(body.shortUrl).toContain(body.shortCode);
    });

    it('deve rejeitar URL sem protocolo', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/shorten',
        payload: { url: 'example.com' },
      });

      expect(response.statusCode).toBe(400);

      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('error');
    });

    it('deve rejeitar URL vazia', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/shorten',
        payload: { url: '' },
      });

      expect(response.statusCode).toBe(400);
    });

    it('deve rejeitar protocolo javascript:', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/shorten',
        payload: { url: 'javascript:alert(1)' },
      });

      expect(response.statusCode).toBe(400);
    });

    it('deve rejeitar protocolo data:', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/shorten',
        payload: { url: 'data:text/html,<script>' },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /:shortCode', () => {
    it('deve redirecionar para URL original', async () => {
      // Primeiro cria uma URL
      const createResponse = await server.inject({
        method: 'POST',
        url: '/shorten',
        payload: { url: 'https://integration-test.com' },
      });

      const created = JSON.parse(createResponse.body);
      const shortCode = created.shortCode;

      // Depois tenta redirecionar
      const redirectResponse = await server.inject({
        method: 'GET',
        url: `/${shortCode}`,
      });

      expect(redirectResponse.statusCode).toBe(301);
      expect(redirectResponse.headers.location).toBe('https://integration-test.com');
    });

    it('deve retornar 404 para código inexistente', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/zzzzzzz',
      });

      expect(response.statusCode).toBe(404);

      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('error', 'Not Found');
    });

    it('deve retornar 400 para código inválido', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/short',
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/:shortCode', () => {
    it('deve retornar informações da URL', async () => {
      // Primeiro cria uma URL
      const createResponse = await server.inject({
        method: 'POST',
        url: '/shorten',
        payload: { url: 'https://api-test.com' },
      });

      const created = JSON.parse(createResponse.body);
      const shortCode = created.shortCode;

      // Depois busca informações
      const infoResponse = await server.inject({
        method: 'GET',
        url: `/api/${shortCode}`,
      });

      expect(infoResponse.statusCode).toBe(200);

      const body = JSON.parse(infoResponse.body);
      expect(body).toHaveProperty('shortCode', shortCode);
      expect(body).toHaveProperty('longUrl', 'https://api-test.com');
      expect(body).toHaveProperty('createdAt');
    });

    it('deve retornar 404 para código inexistente', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/zzzzzzz',
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /health', () => {
    it('deve retornar status ok', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('status', 'ok');
      expect(body).toHaveProperty('timestamp');
    });
  });
});
