import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DB_CONNECTION } from '../../db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';

@Injectable()
export class CompanyProfileService {
  private readonly logger = new Logger(CompanyProfileService.name);

  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findOne() {
    const [profile] = await this.db
      .select()
      .from(schema.companyProfiles)
      .limit(1);

    if (!profile) {
      return null;
    }

    const [seoMeta] = await this.db
      .select()
      .from(schema.seoMetas)
      .where(eq(schema.seoMetas.companyProfileId, profile.id))
      .limit(1);

    return {
      ...profile,
      seoMeta: seoMeta || null,
    };
  }

  async update(dto: UpdateCompanyProfileDto) {
    const [existing] = await this.db
      .select()
      .from(schema.companyProfiles)
      .limit(1);

    if (!existing) {
      throw new NotFoundException('Company profile not found');
    }

    const { seoMeta, socialMedia, ...profileData } = dto;

    await this.db
      .update(schema.companyProfiles)
      .set({
        ...profileData,
        socialMedia: (socialMedia || existing.socialMedia) as schema.SocialMediaItem[],
        updatedAt: new Date(),
      })
      .where(eq(schema.companyProfiles.id, existing.id));

    if (seoMeta) {
      const [existingSeoMeta] = await this.db
        .select()
        .from(schema.seoMetas)
        .where(eq(schema.seoMetas.companyProfileId, existing.id))
        .limit(1);

      if (existingSeoMeta) {
        await this.db
          .update(schema.seoMetas)
          .set({
            ...seoMeta,
            updatedAt: new Date(),
          })
          .where(eq(schema.seoMetas.companyProfileId, existing.id));
      } else {
        await this.db
          .insert(schema.seoMetas)
          .values({
            ...seoMeta,
            companyProfileId: existing.id,
          });
      }
    }

    return this.findOne();
  }
}
