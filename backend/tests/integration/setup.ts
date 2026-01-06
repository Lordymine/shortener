import { prisma } from '../../src/infrastructure/database/prisma';

/**
 * Setup para testes de integração.
 * Executado antes de todos os testes.
 */
export async function setup() {
  console.log('Setting up integration tests...');
  await prisma.$connect();
  console.log('Database connected for integration tests');
}

/**
 * Teardown para testes de integração.
 * Executado após todos os testes.
 */
export async function teardown() {
  console.log('Cleaning up integration tests...');
  await prisma.$disconnect();
  console.log('Database disconnected');
}
