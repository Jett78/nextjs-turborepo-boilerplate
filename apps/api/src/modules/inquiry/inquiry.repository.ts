import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../../db/db.module';
import * as schema from './schema';
import { eq, ilike, or, and, sql, desc } from 'drizzle-orm';

@Injectable()
export class InquiryRepository {
  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(data: typeof schema.messages.$inferInsert) {
    const [inquiry] = await this.db.insert(schema.messages).values(data).returning();
    return inquiry;
  }

  async findById(id: string) {
    const [inquiry] = await this.db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.id, id));

    return inquiry || null;
  }

  async findAll(params?: { skip?: number; take?: number; search?: string }) {
    const conditions = [];

    if (params?.search) {
      conditions.push(
        or(
          ilike(schema.messages.name, `%${params.search}%`),
          ilike(schema.messages.email, `%${params.search}%`),
          ilike(schema.messages.message, `%${params.search}%`),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const inquiries = await this.db
      .select()
      .from(schema.messages)
      .where(whereClause)
      .orderBy(desc(schema.messages.createdAt))
      .limit(params?.take || 10)
      .offset(params?.skip || 0);

    return inquiries;
  }

  async count(params?: { search?: string }) {
    const conditions = [];

    if (params?.search) {
      conditions.push(
        or(
          ilike(schema.messages.name, `%${params.search}%`),
          ilike(schema.messages.email, `%${params.search}%`),
          ilike(schema.messages.message, `%${params.search}%`),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [result] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.messages)
      .where(whereClause);

    return Number(result.count);
  }

  async delete(id: string) {
    const [inquiry] = await this.db
      .delete(schema.messages)
      .where(eq(schema.messages.id, id))
      .returning();

    return inquiry;
  }
}
