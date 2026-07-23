import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InquiryEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Record<string, any>) {
    this.id = partial.id;
    this.name = partial.name;
    this.email = partial.email;
    this.phone = partial.phone ?? undefined;
    this.message = partial.message;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
  }
}
