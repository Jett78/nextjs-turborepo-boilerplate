import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FaqEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  question: string;

  @ApiProperty()
  answer: string;

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
    this.question = partial.question;
    this.answer = partial.answer;
    this.sortOrder = partial.sortOrder;
    this.isActive = partial.isActive ?? true;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
  }
}
