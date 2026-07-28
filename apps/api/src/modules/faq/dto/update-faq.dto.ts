import { PartialType } from '@nestjs/swagger';
import { CreateFaqDto } from './create-faq.dto';
import { IsOptional, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFaqDto extends PartialType(CreateFaqDto) {
  @ApiPropertyOptional({ example: 2, description: 'New sort order - triggers swap if changed' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;
}
