import { IsString, IsOptional, IsArray, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGlobalSeoDto {
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

  @ApiPropertyOptional({ example: 'media/seo/og-image.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  ogImageKey?: string;

  @ApiPropertyOptional({ example: 'GTM-XXXXXXX' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  gtmContainerId?: string;

  @ApiPropertyOptional({ example: 'aBcDeFgHiJkLmNoPqRsTuVwXyZ' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  googleSearchConsoleVerification?: string;
}
