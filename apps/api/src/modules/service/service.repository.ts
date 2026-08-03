import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../../db/db.module';
import * as schema from '../../db/schema';
import { eq, ilike, or, and, sql } from 'drizzle-orm';

@Injectable()
export class ServiceRepository {
  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(data: typeof schema.services.$inferInsert) {
    const [service] = await this.db.insert(schema.services).values(data).returning();
    return service;
  }

  async findById(id: string) {
    const [service] = await this.db
      .select()
      .from(schema.services)
      .where(eq(schema.services.id, id));

    return service || null;
  }

  async findBySlug(slug: string, excludeId?: string) {
    const conditions = [eq(schema.services.slug, slug)];
    if (excludeId) {
      const { ne } = await import('drizzle-orm');
      conditions.push(ne(schema.services.id, excludeId));
    }

    const [service] = await this.db
      .select()
      .from(schema.services)
      .where(and(...conditions));

    return service || null;
  }

  async findMaxSortOrder(): Promise<number> {
    const [result] = await this.db
      .select({ maxSort: sql<number>`coalesce(max(${schema.services.sortOrder}), 0)` })
      .from(schema.services);

    return Number(result.maxSort);
  }

  async swapSortOrder(oldSortOrder: number, newSortOrder: number) {
    const [displaced] = await this.db
      .select()
      .from(schema.services)
      .where(eq(schema.services.sortOrder, newSortOrder));

    if (displaced) {
      await this.db
        .update(schema.services)
        .set({ sortOrder: oldSortOrder, updatedAt: new Date() })
        .where(eq(schema.services.id, displaced.id));
    }
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
  }) {
    const conditions = [];

    if (params?.search) {
      conditions.push(
        or(
          ilike(schema.services.name, `%${params.search}%`),
          ilike(schema.services.shortDescription, `%${params.search}%`),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const services = await this.db
      .select()
      .from(schema.services)
      .where(whereClause)
      .orderBy(schema.services.sortOrder)
      .limit(params?.take || 10)
      .offset(params?.skip || 0);

    return services;
  }

  async count(params?: { search?: string }) {
    const conditions = [];

    if (params?.search) {
      conditions.push(
        or(
          ilike(schema.services.name, `%${params.search}%`),
          ilike(schema.services.shortDescription, `%${params.search}%`),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [result] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.services)
      .where(whereClause);

    return Number(result.count);
  }

  async update(id: string, data: Partial<typeof schema.services.$inferInsert>) {
    const [service] = await this.db
      .update(schema.services)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.services.id, id))
      .returning();

    return service;
  }

  async delete(id: string) {
    const [service] = await this.db
      .delete(schema.services)
      .where(eq(schema.services.id, id))
      .returning();

    return service;
  }

  async reorderAfterDelete(deletedSortOrder: number) {
    await this.db
      .update(schema.services)
      .set({ sortOrder: sql`${schema.services.sortOrder} - 1`, updatedAt: new Date() })
      .where(sql`${schema.services.sortOrder} > ${deletedSortOrder}`);
  }
}
