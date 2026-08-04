import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GalleryEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  images: string[];

  @ApiProperty()
  category: string;

  @ApiPropertyOptional()
  tags?: string[];

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Record<string, any>) {
    this.id = partial.id;
    this.title = partial.title;
    this.slug = partial.slug;
    this.description = partial.description ?? undefined;
    this.images = partial.images ?? [];
    this.category = partial.category;
    this.tags = partial.tags ?? undefined;
    this.sortOrder = partial.sortOrder;
    this.isActive = partial.isActive;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
  }
}
