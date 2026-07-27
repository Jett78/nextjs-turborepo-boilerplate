import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DB_CONNECTION } from '../../db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import { CreatePageSeoDto, UpdatePageSeoDto } from './dto/page-seo.dto';

@Injectable()
export class PageSeoService {
  private readonly logger = new Logger(PageSeoService.name);

  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findAll() {
    return this.db.select().from(schema.pageSeo);
  }

  async findByPath(pagePath: string) {
    const [page] = await this.db
      .select()
      .from(schema.pageSeo)
      .where(eq(schema.pageSeo.pagePath, pagePath))
      .limit(1);

    return page || null;
  }

  async create(dto: CreatePageSeoDto) {
    const ogTitle = dto.metaTitle;
    const ogDescription = dto.metaDescription;

    const [created] = await this.db
      .insert(schema.pageSeo)
      .values({
        pagePath: dto.pagePath!,
        pageTitle: dto.pageTitle,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        ogTitle: dto.ogTitle || ogTitle,
        ogDescription: dto.ogDescription || ogDescription,
        ogImageKey: dto.ogImageKey,
      })
      .returning();

    return created;
  }

  async update(pagePath: string, dto: UpdatePageSeoDto) {
    const [existing] = await this.db
      .select()
      .from(schema.pageSeo)
      .where(eq(schema.pageSeo.pagePath, pagePath))
      .limit(1);

    if (!existing) {
      throw new NotFoundException(`Page SEO not found for path: ${pagePath}`);
    }

    const ogTitle = dto.metaTitle || existing.ogTitle;
    const ogDescription = dto.metaDescription || existing.ogDescription;

    const newPath = dto.pagePath && dto.pagePath !== pagePath ? dto.pagePath : undefined;

    await this.db
      .update(schema.pageSeo)
      .set({
        ...(newPath && { pagePath: newPath }),
        pageTitle: dto.pageTitle,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        ogTitle,
        ogDescription,
        ogImageKey: dto.ogImageKey,
        updatedAt: new Date(),
      })
      .where(eq(schema.pageSeo.id, existing.id));

    const finalPath = newPath || pagePath;
    return this.findByPath(finalPath);
  }

  async upsert(pagePath: string, dto: CreatePageSeoDto) {
    const [existing] = await this.db
      .select()
      .from(schema.pageSeo)
      .where(eq(schema.pageSeo.pagePath, pagePath))
      .limit(1);

    if (existing) {
      return this.update(pagePath, dto);
    }

    return this.create({ ...dto, pagePath });
  }

  async remove(pagePath: string) {
    const [existing] = await this.db
      .select()
      .from(schema.pageSeo)
      .where(eq(schema.pageSeo.pagePath, pagePath))
      .limit(1);

    if (!existing) {
      throw new NotFoundException(`Page SEO not found for path: ${pagePath}`);
    }

    await this.db
      .delete(schema.pageSeo)
      .where(eq(schema.pageSeo.id, existing.id));

    return { success: true };
  }
}
