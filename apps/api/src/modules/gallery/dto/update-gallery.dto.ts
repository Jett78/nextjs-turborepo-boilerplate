import { PartialType } from '@nestjs/swagger';
import { CreateGalleryDto } from './create-gallery.dto';
import { IsOptional, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGalleryDto extends PartialType(CreateGalleryDto) {
  @ApiPropertyOptional({ example: 2, description: 'New sort order - triggers swap if changed' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;
}
