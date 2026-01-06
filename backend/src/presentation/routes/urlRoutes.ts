import type { FastifyInstance, RouteOptions } from 'fastify';
import { UrlController } from '../controllers/UrlController';

/**
 * Registra as rotas de URL no servidor Fastify.
 */
export async function urlRoutes(fastify: FastifyInstance, controller: UrlController): Promise<void> {
  // POST /shorten - Criar URL curta
  fastify.post('/shorten', {
    handler: (request, reply) => controller.createShortUrl(request, reply),
  });

  // GET /health - Health check (registrado antes para evitar conflito)
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  // GET /favicon.ico - Retorna 204 para evitar erro 400 no navegador
  fastify.get('/favicon.ico', async (request, reply) => {
    void reply.code(204).send();
  });

  // GET /api/:shortCode - Obter informações da URL
  fastify.get('/api/:shortCode', {
    handler: (request, reply) => controller.getUrlInfo(request, reply),
  });

  // Hook para validar o formato do shortCode antes de processar a rota
  fastify.addHook('onRoute', (routeOptions: RouteOptions) => {
    if (routeOptions.url === '/:shortCode') {
      routeOptions.schema = {
        params: {
          type: 'object',
          properties: {
            shortCode: {
              type: 'string',
              pattern: '^[0-9a-zA-Z]{7}$',
            },
          },
          required: ['shortCode'],
        },
      };
    }
  });

  // GET /:shortCode - Redirecionar para URL original (deve ser a última rota)
  fastify.get('/:shortCode', {
    handler: (request, reply) => controller.redirectToOriginal(request, reply),
  });
}
