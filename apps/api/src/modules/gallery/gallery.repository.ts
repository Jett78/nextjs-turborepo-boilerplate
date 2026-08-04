import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../../db/db.module';
import * as schema from '../../db/schema';
import { eq, ilike, or, and, sql } from 'drizzle-orm';

@Injectable()
export class GalleryRepository {
  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(data: typeof schema.gallery.$inferInsert) {
    const [item] = await this.db.insert(schema.gallery).values(data).returning();
    return item;
  }

  async findById(id: string) {
    const [item] = await this.db
      .select()
      .from(schema.gallery)
      .where(eq(schema.gallery.id, id));

    return item || null;
  }

  async findBySlug(slug: string, excludeId?: string) {
    const conditions = [eq(schema.gallery.slug, slug)];
    if (excludeId) {
      const { ne } = await import('drizzle-orm');
      conditions.push(ne(schema.gallery.id, excludeId));
    }

    const [item] = await this.db
      .select()
      .from(schema.gallery)
      .where(and(...conditions));

    return item || null;
  }

  async findMaxSortOrder(): Promise<number> {
    const [result] = await this.db
      .select({ maxSort: sql<number>`coalesce(max(${schema.gallery.sortOrder}), 0)` })
      .from(schema.gallery);

    return Number(result.maxSort);
  }

  async swapSortOrder(oldSortOrder: number, newSortOrder: number) {
    const [displaced] = await this.db
      .select()
      .from(schema.gallery)
      .where(eq(schema.gallery.sortOrder, newSortOrder));

    if (displaced) {
      await this.db
        .update(schema.gallery)
        .set({ sortOrder: oldSortOrder, updatedAt: new Date() })
        .where(eq(schema.gallery.id, displaced.id));
    }
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
    category?: string;
  }) {
    const conditions = [];

    if (params?.search) {
      conditions.push(
        or(
          ilike(schema.gallery.title, `%${params.search}%`),
          ilike(schema.gallery.description, `%${params.search}%`),
        ),
      );
    }

    if (params?.category) {
      conditions.push(eq(schema.gallery.category, params.category as any));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const items = await this.db
      .select()
      .from(schema.gallery)
      .where(whereClause)
      .orderBy(schema.gallery.sortOrder)
      .limit(params?.take || 10)
      .offset(params?.skip || 0);

    return items;
  }

  async count(params?: { search?: string; category?: string }) {
    const conditions = [];

    if (params?.search) {
      conditions.push(
        or(
          ilike(schema.gallery.title, `%${params.search}%`),
          ilike(schema.gallery.description, `%${params.search}%`),
        ),
      );
    }

    if (params?.category) {
      conditions.push(eq(schema.gallery.category, params.category as any));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [result] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.gallery)
      .where(whereClause);

    return Number(result.count);
  }

  async update(id: string, data: Partial<typeof schema.gallery.$inferInsert>) {
    const [item] = await this.db
      .update(schema.gallery)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.gallery.id, id))
      .returning();

    return item;
  }

  async delete(id: string) {
    const [item] = await this.db
      .delete(schema.gallery)
      .where(eq(schema.gallery.id, id))
      .returning();

    return item;
  }

  async reorderAfterDelete(deletedSortOrder: number) {
    await this.db
      .update(schema.gallery)
      .set({ sortOrder: sql`${schema.gallery.sortOrder} - 1`, updatedAt: new Date() })
      .where(sql`${schema.gallery.sortOrder} > ${deletedSortOrder}`);
  }
}
