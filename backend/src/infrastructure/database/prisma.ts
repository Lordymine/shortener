import { PrismaClient } from '@prisma/client';

/**
 * Instância singleton do Prisma Client.
 *
 * Em desenvolvimento, cria múltiplas instâncias para evitar
 * problemas com hot reload. Em produção, mantém um singleton.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Conexão com o banco de dados.
 */
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

/**
 * Desconexão do banco de dados.
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  console.log('👋 Database disconnected');
}
