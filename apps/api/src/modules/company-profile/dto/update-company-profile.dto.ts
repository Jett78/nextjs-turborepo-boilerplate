import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCompanyProfileDto {
  @ApiPropertyOptional({ example: 'nextjs boilerplate' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  companyName?: string;

  @ApiPropertyOptional({ example: 'nextjs boilerplate is your template.' })
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

  @ApiPropertyOptional({ example: 'https://facebook.com/mycompany' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  facebookUrl?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/mycompany' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  instagramUrl?: string;

  @ApiPropertyOptional({ example: 'https://tiktok.com/@mycompany' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  tiktokUrl?: string;

  @ApiPropertyOptional({ example: 'https://twitter.com/mycompany' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  twitterUrl?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
