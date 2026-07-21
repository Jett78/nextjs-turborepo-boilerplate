import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../../db/db.module';
import * as schema from '../../db/schema';
import { eq, ilike, or, and, sql, desc } from 'drizzle-orm';

@Injectable()
export class BlogRepository {
  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(data: typeof schema.blogs.$inferInsert) {
    const [blog] = await this.db.insert(schema.blogs).values(data).returning();
    return blog;
  }

  async createSeoMeta(data: typeof schema.seoMetas.$inferInsert) {
    const [seoMeta] = await this.db.insert(schema.seoMetas).values(data).returning();
    return seoMeta;
  }

  async findById(id: string) {
    const [blog] = await this.db
      .select()
      .from(schema.blogs)
      .leftJoin(schema.seoMetas, eq(schema.blogs.id, schema.seoMetas.blogId))
      .where(eq(schema.blogs.id, id));

    if (!blog) return null;

    return {
      ...blog.blogs,
      seoMeta: blog.seo_metas,
    };
  }

  async findBySlug(slug: string) {
    const [blog] = await this.db
      .select()
      .from(schema.blogs)
      .leftJoin(schema.seoMetas, eq(schema.blogs.id, schema.seoMetas.blogId))
      .where(eq(schema.blogs.slug, slug));

    if (!blog) return null;

    return {
      ...blog.blogs,
      seoMeta: blog.seo_metas,
    };
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
          ilike(schema.blogs.title, `%${params.search}%`),
          ilike(schema.blogs.description, `%${params.search}%`),
        ),
      );
    }

    if (params?.isActive !== undefined) {
      conditions.push(eq(schema.blogs.isActive, params.isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const blogs = await this.db
      .select()
      .from(schema.blogs)
      .leftJoin(schema.seoMetas, eq(schema.blogs.id, schema.seoMetas.blogId))
      .where(whereClause)
      .orderBy(desc(schema.blogs.createdAt))
      .limit(params?.take || 10)
      .offset(params?.skip || 0);

    return blogs.map((blog) => ({
      ...blog.blogs,
      seoMeta: blog.seo_metas,
    }));
  }

  async count(params?: { search?: string; isActive?: boolean }) {
    const conditions = [];

    if (params?.search) {
      conditions.push(
        or(
          ilike(schema.blogs.title, `%${params.search}%`),
          ilike(schema.blogs.description, `%${params.search}%`),
        ),
      );
    }

    if (params?.isActive !== undefined) {
      conditions.push(eq(schema.blogs.isActive, params.isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [result] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.blogs)
      .where(whereClause);

    return Number(result.count);
  }

  async update(id: string, data: Partial<typeof schema.blogs.$inferInsert>) {
    const [blog] = await this.db
      .update(schema.blogs)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.blogs.id, id))
      .returning();

    return blog;
  }

  async updateSeoMeta(blogId: string, data: Partial<typeof schema.seoMetas.$inferInsert>) {
    const [seoMeta] = await this.db
      .update(schema.seoMetas)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.seoMetas.blogId, blogId))
      .returning();

    return seoMeta;
  }

  async delete(id: string) {
    const [blog] = await this.db
      .delete(schema.blogs)
      .where(eq(schema.blogs.id, id))
      .returning();

    return blog;
  }

  async deleteSeoMeta(blogId: string) {
    const [seoMeta] = await this.db
      .delete(schema.seoMetas)
      .where(eq(schema.seoMetas.blogId, blogId))
      .returning();

    return seoMeta;
  }
}
