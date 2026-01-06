/**
 * Configuração do Rate Limiting.
 *
 * Limita requisições por IP para prevenir abuso e DDoS.
 */
export const rateLimitConfig = {
  max: 100, // Máximo de requisições
  timeWindow: '1 minute', // Janela de tempo

  // Configuração adicional
  cache: 10000,
  allowList: ['127.0.0.1'], // Localhost sempre permitido
  continueExceeding: false,

  // Resposta customizada
  errorResponseBuilder: function () {
    return {
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
    };
  },

  // Skip para requisições de saúde
  skipOnError: false,
};

/**
 * Configuração de Rate Limiting específica para criação de URLs.
 * Mais restritivo para prevenir abuso.
 */
export const createUrlRateLimitConfig = {
  max: 20, // Máximo 20 URLs por minuto
  timeWindow: '1 minute',
  cache: 10000,
  continueExceeding: false,

  errorResponseBuilder: function () {
    return {
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'URL creation rate limit exceeded. Please try again later.',
    };
  },
};
