import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { config } from './config';
import { prisma, connectDatabase, disconnectDatabase } from './infrastructure/database/prisma';
import { PrismaUrlRepository } from './infrastructure/repositories/PrismaUrlRepository';
import { ShortCodeGenerator } from './domain/services/ShortCodeGenerator';
import { CreateShortUrlUseCase } from './application/use-cases/CreateShortUrl';
import { GetOriginalUrlUseCase } from './application/use-cases/GetOriginalUrl';
import { UrlController } from './presentation/controllers/UrlController';
import { urlRoutes } from './presentation/routes';

/**
 * Cria e configura o servidor Fastify.
 */
export async function createServer() {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
    },
  });

  // Registro de plugins
  await fastify.register(helmet);
  await fastify.register(cors, {
    origin: config.corsOrigin,
    credentials: true,
  });
  await fastify.register(rateLimit, config.rateLimit);

  // Setup de dependências
  const urlRepository = new PrismaUrlRepository(prisma);
  const shortCodeGenerator = new ShortCodeGenerator(config.hashSalt);
  const createUrlUseCase = new CreateShortUrlUseCase(
    urlRepository,
    shortCodeGenerator,
    config.baseUrl
  );
  const getOriginalUrlUseCase = new GetOriginalUrlUseCase(urlRepository);
  const urlController = new UrlController(createUrlUseCase, getOriginalUrlUseCase);

  // Registro de rotas
  await fastify.register(async (instance) => {
    await urlRoutes(instance, urlController);
  });

  return fastify;
}

/**
 * Inicia o servidor.
 */
export async function startServer(): Promise<void> {
  await connectDatabase();

  const server = await createServer();

  try {
    const port = Number(config.port) ?? 3001;
    const host = config.host ?? '0.0.0.0';

    await server.listen({ port, host });

    console.log(`
    ╔═══════════════════════════════════════════════════════╗
    ║                                                       ║
    ║        🚀 URL Shortener API is running!              ║
    ║                                                       ║
    ║        Local:   http://localhost:${port}                   ║
    ║        Health:  http://localhost:${port}/health             ║
    ║                                                       ║
    ╚═══════════════════════════════════════════════════════╝
    `);
  } catch (err) {
    server.log.error(err);
    await disconnectDatabase();
    process.exit(1);
  }
}

// Inicia o servidor se este arquivo for executado diretamente
if (require.main === module) {
  startServer();
}
