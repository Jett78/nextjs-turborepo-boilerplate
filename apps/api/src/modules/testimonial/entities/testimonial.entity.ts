import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TestimonialEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  designation?: string;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Record<string, any>) {
    this.id = partial.id;
    this.name = partial.name;
    this.message = partial.message;
    this.avatar = partial.avatar ?? undefined;
    this.designation = partial.designation ?? undefined;
    this.sortOrder = partial.sortOrder;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
  }
}
