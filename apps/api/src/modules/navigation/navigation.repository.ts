import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../../db/db.module';
import * as schema from '../../db/schema';
import { eq, ilike, or, and, sql } from 'drizzle-orm';

@Injectable()
export class NavigationRepository {
  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: string) {
    const [item] = await this.db
      .select()
      .from(schema.navigationItems)
      .where(eq(schema.navigationItems.id, id));

    return item || null;
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
    isActive?: boolean;
  }) {
    const conditions = [];

    if (params?.search) {
      conditions.push(
        or(
          ilike(schema.navigationItems.label, `%${params.search}%`),
          ilike(schema.navigationItems.path, `%${params.search}%`),
          ilike(schema.navigationItems.key, `%${params.search}%`),
        ),
      );
    }

    if (params?.isActive !== undefined) {
      conditions.push(eq(schema.navigationItems.isActive, params.isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const items = await this.db
      .select()
      .from(schema.navigationItems)
      .where(whereClause)
      .orderBy(schema.navigationItems.sortOrder)
      .limit(params?.take || 100)
      .offset(params?.skip || 0);

    return items;
  }

  async count(params?: { search?: string; isActive?: boolean }) {
    const conditions = [];

    if (params?.search) {
      conditions.push(
        or(
          ilike(schema.navigationItems.label, `%${params.search}%`),
          ilike(schema.navigationItems.path, `%${params.search}%`),
          ilike(schema.navigationItems.key, `%${params.search}%`),
        ),
      );
    }

    if (params?.isActive !== undefined) {
      conditions.push(eq(schema.navigationItems.isActive, params.isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [result] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.navigationItems)
      .where(whereClause);

    return Number(result.count);
  }

  async update(id: string, data: Partial<typeof schema.navigationItems.$inferInsert>) {
    const [item] = await this.db
      .update(schema.navigationItems)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.navigationItems.id, id))
      .returning();

    return item;
  }

  async swapSortOrder(oldSortOrder: number, newSortOrder: number) {
    const [displaced] = await this.db
      .select()
      .from(schema.navigationItems)
      .where(eq(schema.navigationItems.sortOrder, newSortOrder));

    if (displaced) {
      await this.db
        .update(schema.navigationItems)
        .set({ sortOrder: oldSortOrder, updatedAt: new Date() })
        .where(eq(schema.navigationItems.id, displaced.id));
    }
  }
}
