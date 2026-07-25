import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DB_CONNECTION } from '../../db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import { UpdateGlobalSeoDto } from './dto/update-seo.dto';

@Injectable()
export class SeoService {
  private readonly logger = new Logger(SeoService.name);

  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findOne() {
    const [seo] = await this.db
      .select()
      .from(schema.globalSeo)
      .limit(1);

    return seo || null;
  }

  async findPublic() {
    const [seo] = await this.db
      .select()
      .from(schema.globalSeo)
      .limit(1);

    if (!seo) return null;

    return {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      metaKeywords: seo.metaKeywords,
      ogTitle: seo.ogTitle,
      ogDescription: seo.ogDescription,
      ogImageKey: seo.ogImageKey,
      gtmContainerId: seo.gtmContainerId,
      googleSearchConsoleVerification: seo.googleSearchConsoleVerification,
    };
  }

  async upsert(dto: UpdateGlobalSeoDto) {
    const [existing] = await this.db
      .select()
      .from(schema.globalSeo)
      .limit(1);

    const ogTitle = dto.metaTitle || existing?.ogTitle;
    const ogDescription = dto.metaDescription || existing?.ogDescription;

    if (existing) {
      await this.db
        .update(schema.globalSeo)
        .set({
          ...dto,
          ogTitle,
          ogDescription,
          updatedAt: new Date(),
        })
        .where(eq(schema.globalSeo.id, existing.id));
    } else {
      await this.db
        .insert(schema.globalSeo)
        .values({
          ...dto,
          ogTitle,
          ogDescription,
        });
    }

    return this.findOne();
  }
}
