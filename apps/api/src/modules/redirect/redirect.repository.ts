import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../../db/db.module';
import * as schema from '../../db/schema';
import { eq, ilike, or, and, sql } from 'drizzle-orm';

@Injectable()
export class RedirectRepository {
  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(data: typeof schema.redirects.$inferInsert) {
    const [redirect] = await this.db.insert(schema.redirects).values(data).returning();
    return redirect;
  }

  async findById(id: string) {
    const [redirect] = await this.db
      .select()
      .from(schema.redirects)
      .where(eq(schema.redirects.id, id));

    return redirect || null;
  }

  async findByFromPath(fromPath: string) {
    const [redirect] = await this.db
      .select()
      .from(schema.redirects)
      .where(eq(schema.redirects.fromPath, fromPath));

    return redirect || null;
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
          ilike(schema.redirects.fromPath, `%${params.search}%`),
          ilike(schema.redirects.toPath, `%${params.search}%`),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const redirects = await this.db
      .select()
      .from(schema.redirects)
      .where(whereClause)
      .orderBy(schema.redirects.createdAt)
      .limit(params?.take || 10)
      .offset(params?.skip || 0);

    return redirects;
  }

  async findAllActive() {
    const redirects = await this.db
      .select()
      .from(schema.redirects)
      .where(eq(schema.redirects.isActive, true));

    return redirects;
  }

  async count(params?: { search?: string }) {
    const conditions = [];

    if (params?.search) {
      conditions.push(
        or(
          ilike(schema.redirects.fromPath, `%${params.search}%`),
          ilike(schema.redirects.toPath, `%${params.search}%`),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [result] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.redirects)
      .where(whereClause);

    return Number(result.count);
  }

  async update(id: string, data: Partial<typeof schema.redirects.$inferInsert>) {
    const [redirect] = await this.db
      .update(schema.redirects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.redirects.id, id))
      .returning();

    return redirect;
  }

  async delete(id: string) {
    const [redirect] = await this.db
      .delete(schema.redirects)
      .where(eq(schema.redirects.id, id))
      .returning();

    return redirect;
  }
}
