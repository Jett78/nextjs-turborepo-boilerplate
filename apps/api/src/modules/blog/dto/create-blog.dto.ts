import { IsString, IsOptional, IsBoolean, ValidateNested, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSeoMetaDto {
  @ApiPropertyOptional({ example: 'Blog Title - SEO Optimized' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;

  @ApiPropertyOptional({ example: 'This is a meta description for SEO' })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({ example: ['keyword1', 'keyword2', 'keyword3'] })
  @IsOptional()
  @IsString({ each: true })
  metaKeywords?: string[];

  @ApiPropertyOptional({ example: 'https://example.com/blog/post' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  canonicalUrl?: string;

  @ApiPropertyOptional({ example: 'index, follow', default: 'index, follow' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  metaRobots?: string;

  @ApiPropertyOptional({ example: 'OG Title' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  ogTitle?: string;

  @ApiPropertyOptional({ example: 'OG Description' })
  @IsOptional()
  @IsString()
  ogDescription?: string;

  @ApiPropertyOptional({ example: 'og-images/image.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  ogImageKey?: string;
}

export class CreateBlogDto {
  @ApiProperty({ example: 'My Awesome Blog Post' })
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  title: string;

  @ApiProperty({ example: 'my-awesome-blog-post' })
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  slug: string;

  @ApiPropertyOptional({ example: 'blogs/cover-image.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageKey?: string;

  @ApiPropertyOptional({ example: 'This is the blog description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ type: CreateSeoMetaDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSeoMetaDto)
  seoMeta?: CreateSeoMetaDto;
}
