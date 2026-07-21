import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SeoMetaEntity {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  metaTitle?: string;

  @ApiPropertyOptional()
  metaDescription?: string;

  @ApiPropertyOptional({ type: [String] })
  metaKeywords?: string[];

  @ApiPropertyOptional()
  canonicalUrl?: string;

  @ApiPropertyOptional()
  metaRobots?: string;

  @ApiPropertyOptional()
  ogTitle?: string;

  @ApiPropertyOptional()
  ogDescription?: string;

  @ApiPropertyOptional()
  ogImageKey?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  blogId?: string;

  constructor(partial: Record<string, any>) {
    this.id = partial.id;
    this.metaTitle = partial.metaTitle ?? undefined;
    this.metaDescription = partial.metaDescription ?? undefined;
    this.metaKeywords = partial.metaKeywords ?? undefined;
    this.canonicalUrl = partial.canonicalUrl ?? undefined;
    this.metaRobots = partial.metaRobots ?? undefined;
    this.ogTitle = partial.ogTitle ?? undefined;
    this.ogDescription = partial.ogDescription ?? undefined;
    this.ogImageKey = partial.ogImageKey ?? undefined;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
    this.blogId = partial.blogId ?? undefined;
  }
}
