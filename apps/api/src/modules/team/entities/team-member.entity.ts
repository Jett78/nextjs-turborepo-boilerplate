import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TeamMemberEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  designation?: string;

  @ApiPropertyOptional()
  joinedDate?: Date;

  @ApiPropertyOptional()
  message?: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  whatsappUrl?: string;

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
    this.designation = partial.designation ?? undefined;
    this.joinedDate = partial.joinedDate ?? undefined;
    this.message = partial.message ?? undefined;
    this.avatar = partial.avatar ?? undefined;
    this.whatsappUrl = partial.whatsappUrl ?? undefined;
    this.sortOrder = partial.sortOrder;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
  }
}
