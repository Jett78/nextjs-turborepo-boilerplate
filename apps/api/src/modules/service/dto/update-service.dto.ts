import { PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';
import { IsOptional, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @ApiPropertyOptional({ example: 2, description: 'New sort order - triggers swap if changed' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;
}
