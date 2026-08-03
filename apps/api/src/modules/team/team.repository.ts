import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../../db/db.module';
import * as schema from '../../db/schema';
import { eq, ilike, or, and, sql } from 'drizzle-orm';

@Injectable()
export class TeamRepository {
  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(data: typeof schema.teamMembers.$inferInsert) {
    const [teamMember] = await this.db.insert(schema.teamMembers).values(data).returning();
    return teamMember;
  }

  async findById(id: string) {
    const [teamMember] = await this.db
      .select()
      .from(schema.teamMembers)
      .where(eq(schema.teamMembers.id, id));

    return teamMember || null;
  }

  async findBySlug(slug: string, excludeId?: string) {
    const conditions = [eq(schema.teamMembers.slug, slug)];
    if (excludeId) {
      const { ne } = await import('drizzle-orm');
      conditions.push(ne(schema.teamMembers.id, excludeId));
    }

    const [teamMember] = await this.db
      .select()
      .from(schema.teamMembers)
      .where(and(...conditions));

    return teamMember || null;
  }

  async findMaxSortOrder(): Promise<number> {
    const [result] = await this.db
      .select({ maxSort: sql<number>`coalesce(max(${schema.teamMembers.sortOrder}), 0)` })
      .from(schema.teamMembers);

    return Number(result.maxSort);
  }

  async swapSortOrder(oldSortOrder: number, newSortOrder: number) {
    const [displaced] = await this.db
      .select()
      .from(schema.teamMembers)
      .where(eq(schema.teamMembers.sortOrder, newSortOrder));

    if (displaced) {
      await this.db
        .update(schema.teamMembers)
        .set({ sortOrder: oldSortOrder, updatedAt: new Date() })
        .where(eq(schema.teamMembers.id, displaced.id));
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
          ilike(schema.teamMembers.name, `%${params.search}%`),
          ilike(schema.teamMembers.designation, `%${params.search}%`),
          ilike(schema.teamMembers.message, `%${params.search}%`),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const teamMembers = await this.db
      .select()
      .from(schema.teamMembers)
      .where(whereClause)
      .orderBy(schema.teamMembers.sortOrder)
      .limit(params?.take || 10)
      .offset(params?.skip || 0);

    return teamMembers;
  }

  async count(params?: { search?: string }) {
    const conditions = [];

    if (params?.search) {
      conditions.push(
        or(
          ilike(schema.teamMembers.name, `%${params.search}%`),
          ilike(schema.teamMembers.designation, `%${params.search}%`),
          ilike(schema.teamMembers.message, `%${params.search}%`),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [result] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.teamMembers)
      .where(whereClause);

    return Number(result.count);
  }

  async update(id: string, data: Partial<typeof schema.teamMembers.$inferInsert>) {
    const [teamMember] = await this.db
      .update(schema.teamMembers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.teamMembers.id, id))
      .returning();

    return teamMember;
  }

  async delete(id: string) {
    const [teamMember] = await this.db
      .delete(schema.teamMembers)
      .where(eq(schema.teamMembers.id, id))
      .returning();

    return teamMember;
  }

  async reorderAfterDelete(deletedSortOrder: number) {
    await this.db
      .update(schema.teamMembers)
      .set({ sortOrder: sql`${schema.teamMembers.sortOrder} - 1`, updatedAt: new Date() })
      .where(sql`${schema.teamMembers.sortOrder} > ${deletedSortOrder}`);
  }
}
