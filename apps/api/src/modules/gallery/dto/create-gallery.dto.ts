import { IsString, IsOptional, MaxLength, MinLength, IsNumber, IsBoolean, IsArray, Min, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGalleryDto {
  @ApiProperty({ example: 'Project Showcase' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ example: 'A collection of our recent projects' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'], description: 'Array of image URLs' })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiPropertyOptional({ example: 'portfolio', enum: ['portfolio', 'team', 'events', 'behind_the_scenes', 'testimonials', 'other'] })
  @IsOptional()
  @IsString()
  @IsIn(['portfolio', 'team', 'events', 'behind_the_scenes', 'testimonials', 'other'])
  category?: string;

  @ApiPropertyOptional({ example: ['web', 'design', 'branding'], description: 'Array of tags' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'project-showcase' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  slug?: string;
}
