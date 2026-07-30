import { Injectable, Inject } from '@nestjs/common';
import { DB_CONNECTION } from '../../db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { sql } from 'drizzle-orm';

@Injectable()
export class DashboardStatsService {
  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<Record<string, never>>,
  ) {}

  async getStats() {
    const [blogsCount, testimonialsCount, inquiriesCount, usersCount] =
      await Promise.all([
        this.db
          .select({ count: sql<number>`count(*)` })
          .from(schema.blogs)
          .then((result) => Number(result[0].count)),
        this.db
          .select({ count: sql<number>`count(*)` })
          .from(schema.testimonials)
          .then((result) => Number(result[0].count)),
        this.db
          .select({ count: sql<number>`count(*)` })
          .from(schema.messages)
          .then((result) => Number(result[0].count)),
        this.db
          .select({ count: sql<number>`count(*)` })
          .from(schema.user)
          .then((result) => Number(result[0].count)),
      ]);

    return {
      blogs: blogsCount,
      testimonials: testimonialsCount,
      inquiries: inquiriesCount,
      users: usersCount,
    };
  }
}