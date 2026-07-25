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

    return profile || null;
  }

  async update(dto: UpdateCompanyProfileDto) {
    const [existing] = await this.db
      .select()
      .from(schema.companyProfiles)
      .limit(1);

    if (!existing) {
      throw new NotFoundException('Company profile not found');
    }

    const { socialMedia, ...profileData } = dto;

    await this.db
      .update(schema.companyProfiles)
      .set({
        ...profileData,
        socialMedia: (socialMedia || existing.socialMedia) as schema.SocialMediaItem[],
        updatedAt: new Date(),
      })
      .where(eq(schema.companyProfiles.id, existing.id));

    return this.findOne();
  }
}
