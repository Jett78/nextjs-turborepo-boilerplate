import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SeoMetaEntity } from './seo-meta.entity';

export class BlogEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  imageKey?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ type: SeoMetaEntity })
  seoMeta?: SeoMetaEntity;

  constructor(partial: Record<string, any>) {
    this.id = partial.id;
    this.title = partial.title;
    this.slug = partial.slug;
    this.imageKey = partial.imageKey ?? undefined;
    this.description = partial.description ?? undefined;
    this.isActive = partial.isActive;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
    if (partial.seoMeta) {
      this.seoMeta = new SeoMetaEntity(partial.seoMeta);
    }
  }
}
