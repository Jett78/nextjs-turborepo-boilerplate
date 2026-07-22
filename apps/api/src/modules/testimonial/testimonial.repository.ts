import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../../db/db.module';
import * as schema from '../../db/schema';
import { eq, ilike, or, and, sql, desc } from 'drizzle-orm';

@Injectable()
export class TestimonialRepository {
  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(data: typeof schema.testimonials.$inferInsert) {
    const [testimonial] = await this.db.insert(schema.testimonials).values(data).returning();
    return testimonial;
  }

  async findById(id: string) {
    const [testimonial] = await this.db
      .select()
      .from(schema.testimonials)
      .where(eq(schema.testimonials.id, id));

    return testimonial || null;
  }

  async findMaxSortOrder(): Promise<number> {
    const [result] = await this.db
      .select({ maxSort: sql<number>`coalesce(max(${schema.testimonials.sortOrder}), 0)` })
      .from(schema.testimonials);

    return Number(result.maxSort);
  }

  async swapSortOrder(oldSortOrder: number, newSortOrder: number) {
    const [displaced] = await this.db
      .select()
      .from(schema.testimonials)
      .where(eq(schema.testimonials.sortOrder, newSortOrder));

    if (displaced) {
      await this.db
        .update(schema.testimonials)
        .set({ sortOrder: oldSortOrder, updatedAt: new Date() })
        .where(eq(schema.testimonials.id, displaced.id));
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
          ilike(schema.testimonials.name, `%${params.search}%`),
          ilike(schema.testimonials.message, `%${params.search}%`),
          ilike(schema.testimonials.designation, `%${params.search}%`),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const testimonials = await this.db
      .select()
      .from(schema.testimonials)
      .where(whereClause)
      .orderBy(schema.testimonials.sortOrder)
      .limit(params?.take || 10)
      .offset(params?.skip || 0);

    return testimonials;
  }

  async count(params?: { search?: string }) {
    const conditions = [];

    if (params?.search) {
      conditions.push(
        or(
          ilike(schema.testimonials.name, `%${params.search}%`),
          ilike(schema.testimonials.message, `%${params.search}%`),
          ilike(schema.testimonials.designation, `%${params.search}%`),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [result] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.testimonials)
      .where(whereClause);

    return Number(result.count);
  }

  async update(id: string, data: Partial<typeof schema.testimonials.$inferInsert>) {
    const [testimonial] = await this.db
      .update(schema.testimonials)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.testimonials.id, id))
      .returning();

    return testimonial;
  }

  async delete(id: string) {
    const [testimonial] = await this.db
      .delete(schema.testimonials)
      .where(eq(schema.testimonials.id, id))
      .returning();

    return testimonial;
  }

  async reorderAfterDelete(deletedSortOrder: number) {
    await this.db
      .update(schema.testimonials)
      .set({ sortOrder: sql`${schema.testimonials.sortOrder} - 1`, updatedAt: new Date() })
      .where(sql`${schema.testimonials.sortOrder} > ${deletedSortOrder}`);
  }
}
