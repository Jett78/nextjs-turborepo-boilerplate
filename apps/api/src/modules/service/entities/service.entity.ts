import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ServiceEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  imageKey?: string;

  @ApiPropertyOptional()
  shortDescription?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  price?: number;

  @ApiPropertyOptional()
  offerPrice?: number;

  @ApiPropertyOptional()
  features?: string[];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Record<string, any>) {
    this.id = partial.id;
    this.name = partial.name;
    this.slug = partial.slug;
    this.imageKey = partial.imageKey ?? undefined;
    this.shortDescription = partial.shortDescription ?? undefined;
    this.description = partial.description ?? undefined;
    this.price = partial.price ?? undefined;
    this.offerPrice = partial.offerPrice ?? undefined;
    this.features = partial.features ?? undefined;
    this.isActive = partial.isActive;
    this.sortOrder = partial.sortOrder;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
  }
}
