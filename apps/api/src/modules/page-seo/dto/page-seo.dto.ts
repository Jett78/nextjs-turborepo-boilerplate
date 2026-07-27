import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePageSeoDto {
  @ApiPropertyOptional({ example: '/about' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  pagePath?: string;

  @ApiPropertyOptional({ example: 'About Us' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  pageTitle?: string;

  @ApiPropertyOptional({ example: 'About Us - My Company' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;

  @ApiPropertyOptional({ example: 'Learn more about our company.' })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({ example: 'About Us' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  ogTitle?: string;

  @ApiPropertyOptional({ example: 'Learn more about our company.' })
  @IsOptional()
  @IsString()
  ogDescription?: string;

  @ApiPropertyOptional({ example: 'media/seo/about-og.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  ogImageKey?: string;
}

export class UpdatePageSeoDto {
  @ApiPropertyOptional({ example: '/about' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  pagePath?: string;

  @ApiPropertyOptional({ example: 'About Us' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  pageTitle?: string;

  @ApiPropertyOptional({ example: 'About Us - My Company' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;

  @ApiPropertyOptional({ example: 'Learn more about our company.' })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({ example: 'About Us' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  ogTitle?: string;

  @ApiPropertyOptional({ example: 'Learn more about our company.' })
  @IsOptional()
  @IsString()
  ogDescription?: string;

  @ApiPropertyOptional({ example: 'media/seo/about-og.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  ogImageKey?: string;
}
