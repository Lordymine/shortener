import type { FastifyRequest, FastifyReply } from 'fastify';
import { CreateShortUrlUseCase } from '../../application/use-cases/CreateShortUrl';
import { GetOriginalUrlUseCase } from '../../application/use-cases/GetOriginalUrl';
import {
  InvalidUrlError,
  UrlNotFoundError,
  ValidationException,
} from '../../application/dtos';

/**
 * Controller para operações de URL.
 */
export class UrlController {
  constructor(
    private readonly createUrlUseCase: CreateShortUrlUseCase,
    private readonly getOriginalUrlUseCase: GetOriginalUrlUseCase
  ) {}

  /**
   * POST /shorten - Cria uma URL curta
   */
  async createShortUrl(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = request.body as { url?: string };

      if (!body?.url) {
        await reply.code(400).send({
          error: 'Bad Request',
          message: 'URL is required',
        });
        return;
      }

      const result = await this.createUrlUseCase.execute({ url: body.url });

      await reply.code(201).send(result);
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * GET /:shortCode - Redireciona para a URL original
   */
  async redirectToOriginal(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { shortCode } = request.params as { shortCode?: string };

      if (!shortCode) {
        await reply.code(400).send({
          error: 'Bad Request',
          message: 'Short code is required',
        });
        return;
      }

      const longUrl = await this.getOriginalUrlUseCase.getLongUrl(shortCode);

      // Redireciona com status 301 (Moved Permanently) para cache
      await reply.code(301).redirect(longUrl);
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * GET /api/:shortCode - Retorna informações da URL (sem redirecionar)
   */
  async getUrlInfo(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { shortCode } = request.params as { shortCode?: string };

      if (!shortCode) {
        await reply.code(400).send({
          error: 'Bad Request',
          message: 'Short code is required',
        });
        return;
      }

      const result = await this.getOriginalUrlUseCase.execute(shortCode);

      await reply.send(result);
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * Tratamento de erros
   */
  private handleError(error: unknown, reply: FastifyReply): void {
    console.error('Error:', error);

    if (error instanceof InvalidUrlError) {
      reply.code(400).send({
        error: 'Bad Request',
        message: error.message,
      });
      return;
    }

    if (error instanceof UrlNotFoundError) {
      reply.code(404).send({
        error: 'Not Found',
        message: error.message,
      });
      return;
    }

    if (error instanceof ValidationException) {
      reply.code(400).send({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    // Erro genérico
    reply.code(500).send({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });
  }
}
