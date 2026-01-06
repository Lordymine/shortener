export const config = {
  port: process.env.PORT ?? '3001',
  host: process.env.HOST ?? '0.0.0.0',
  baseUrl: process.env.BASE_URL ?? 'http://localhost:3001',
  corsOrigin: process.env.CORS_ORIGIN ?? true,
  rateLimit: {
    max: Number(process.env.RATE_LIMIT_MAX) ?? 100,
    timeWindow: (process.env.RATE_LIMIT_WINDOW ?? '1 minute'),
  },
  hashSalt: process.env.HASH_SALT ?? 'default-salt-change-in-production',
  logLevel: process.env.LOG_LEVEL ?? 'info',
  nodeEnv: process.env.NODE_ENV ?? 'development',
} as const;

export function validateConfig(): void {
  if (config.nodeEnv === 'production' && config.hashSalt === 'default-salt-change-in-production') {
    console.warn('Using default HASH_SALT in production!');
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }
}
