import { PrismaClient } from '@prisma/client';
import type { IUrlRepository } from '../../domain/repositories/IUrlRepository';
import type { Url } from '../../domain/entities/Url';

/**
 * Implementação do repositório de URLs usando Prisma ORM.
 */
export class PrismaUrlRepository implements IUrlRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(url: Url): Promise<Url> {
    const saved = await this.prisma.url.create({
      data: {
        shortCode: url.shortCode,
        longUrl: url.longUrl,
      },
    });

    return {
      id: saved.id,
      shortCode: saved.shortCode,
      longUrl: saved.longUrl,
      createdAt: saved.createdAt,
    };
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    const found = await this.prisma.url.findUnique({
      where: { shortCode },
    });

    if (!found) {
      return null;
    }

    return {
      id: found.id,
      shortCode: found.shortCode,
      longUrl: found.longUrl,
      createdAt: found.createdAt,
    };
  }

  async existsByShortCode(shortCode: string): Promise<boolean> {
    const count = await this.prisma.url.count({
      where: { shortCode },
    });

    return count > 0;
  }

  async findByLongUrl(longUrl: string): Promise<Url | null> {
    const found = await this.prisma.url.findFirst({
      where: { longUrl },
    });

    if (!found) {
      return null;
    }

    return {
      id: found.id,
      shortCode: found.shortCode,
      longUrl: found.longUrl,
      createdAt: found.createdAt,
    };
  }
}
