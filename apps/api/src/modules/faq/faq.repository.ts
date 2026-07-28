import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../../db/db.module';
import * as schema from '../../db/schema';
import { eq, ilike, or, and, sql, desc } from 'drizzle-orm';

@Injectable()
export class FaqRepository {
  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(data: typeof schema.faqs.$inferInsert) {
    const [faq] = await this.db.insert(schema.faqs).values(data).returning();
    return faq;
  }

  async findById(id: string) {
    const [faq] = await this.db
      .select()
      .from(schema.faqs)
      .where(eq(schema.faqs.id, id));

    return faq || null;
  }

  async findMaxSortOrder(): Promise<number> {
    const [result] = await this.db
      .select({ maxSort: sql<number>`coalesce(max(${schema.faqs.sortOrder}), 0)` })
      .from(schema.faqs);

    return Number(result.maxSort);
  }

  async swapSortOrder(oldSortOrder: number, newSortOrder: number) {
    const [displaced] = await this.db
      .select()
      .from(schema.faqs)
      .where(eq(schema.faqs.sortOrder, newSortOrder));

    if (displaced) {
      await this.db
        .update(schema.faqs)
        .set({ sortOrder: oldSortOrder, updatedAt: new Date() })
        .where(eq(schema.faqs.id, displaced.id));
    }
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
          ilike(schema.faqs.question, `%${params.search}%`),
          ilike(schema.faqs.answer, `%${params.search}%`),
        ),
      );
    }

    if (params?.isActive !== undefined) {
      conditions.push(eq(schema.faqs.isActive, params.isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const faqs = await this.db
      .select()
      .from(schema.faqs)
      .where(whereClause)
      .orderBy(schema.faqs.sortOrder)
      .limit(params?.take || 10)
      .offset(params?.skip || 0);

    return faqs;
  }

  async count(params?: { search?: string; isActive?: boolean }) {
    const conditions = [];

    if (params?.search) {
      conditions.push(
        or(
          ilike(schema.faqs.question, `%${params.search}%`),
          ilike(schema.faqs.answer, `%${params.search}%`),
        ),
      );
    }

    if (params?.isActive !== undefined) {
      conditions.push(eq(schema.faqs.isActive, params.isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [result] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.faqs)
      .where(whereClause);

    return Number(result.count);
  }

  async update(id: string, data: Partial<typeof schema.faqs.$inferInsert>) {
    const [faq] = await this.db
      .update(schema.faqs)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.faqs.id, id))
      .returning();

    return faq;
  }

  async delete(id: string) {
    const [faq] = await this.db
      .delete(schema.faqs)
      .where(eq(schema.faqs.id, id))
      .returning();

    return faq;
  }

  async reorderAfterDelete(deletedSortOrder: number) {
    await this.db
      .update(schema.faqs)
      .set({ sortOrder: sql`${schema.faqs.sortOrder} - 1`, updatedAt: new Date() })
      .where(sql`${schema.faqs.sortOrder} > ${deletedSortOrder}`);
  }
}
