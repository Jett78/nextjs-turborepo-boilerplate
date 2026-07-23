import { IsString, IsOptional, IsBoolean, ValidateNested, IsArray, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SocialMediaDto {
  @ApiProperty({ example: 'Facebook' })
  @IsString()
  platform: string;

  @ApiProperty({ example: 'https://facebook.com/mycompany' })
  @IsString()
  url: string;

  @ApiProperty({ example: 0 })
  @IsOptional()
  order?: number;
}

export class CompanyProfileSeoMetaDto {
  @ApiPropertyOptional({ example: 'My Awesome Page Title' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;

  @ApiPropertyOptional({ example: 'This is a description of my awesome page.' })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({ example: ['keyword1', 'keyword2'] })
  @IsOptional()
  @IsString({ each: true })
  metaKeywords?: string[];

  @ApiPropertyOptional({ example: 'https://example.com/canonical-url' })
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

  @ApiPropertyOptional({ example: 'media/seo/og-image.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  ogImageKey?: string;
}

export class UpdateCompanyProfileDto {
  @ApiPropertyOptional({ example: 'Law Sagar' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  companyName?: string;

  @ApiPropertyOptional({ example: 'Law Sagar is your trusted legal partner.' })
  @IsOptional()
  @IsString()
  companyDescription?: string;

  @ApiPropertyOptional({ example: 'Kathmandu, Nepal' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+977-9800000000' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'info@nepaltech.com' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ example: 'string' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  logoKey?: string;

  @ApiPropertyOptional({ example: 'string' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  footerLogoKey?: string;

  @ApiPropertyOptional({ example: 'string' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  faviconKey?: string;

  @ApiPropertyOptional({ example: '+977-9800000000' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  whatsappNumber?: string;

  @ApiPropertyOptional({ example: '<iframe>...</iframe>' })
  @IsOptional()
  @IsString()
  googleMap?: string;

  @ApiPropertyOptional({ example: '221.2 83.2% 53.3%', description: 'HSL color value (e.g., "221.2 83.2% 53.3%")' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  primaryColor?: string;

  @ApiPropertyOptional({ example: '210 40% 96.1%', description: 'HSL color value (e.g., "210 40% 96.1%")' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  secondaryColor?: string;

  @ApiPropertyOptional({ type: [SocialMediaDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialMediaDto)
  socialMedia?: SocialMediaDto[];

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ type: CompanyProfileSeoMetaDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CompanyProfileSeoMetaDto)
  seoMeta?: CompanyProfileSeoMetaDto;
}
