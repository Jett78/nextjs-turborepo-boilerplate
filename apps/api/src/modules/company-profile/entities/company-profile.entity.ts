import { ApiProperty } from '@nestjs/swagger';

export class CompanyProfileSeoMetaEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  metaTitle?: string;

  @ApiProperty()
  metaDescription?: string;

  @ApiProperty()
  metaKeywords?: string[];

  @ApiProperty()
  canonicalUrl?: string;

  @ApiProperty()
  metaRobots?: string;

  @ApiProperty()
  ogTitle?: string;

  @ApiProperty()
  ogDescription?: string;

  @ApiProperty()
  ogImageKey?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  companyProfileId?: string;

  constructor(partial: Partial<CompanyProfileSeoMetaEntity>) {
    Object.assign(this, partial);
  }
}

export class SocialMediaEntity {
  @ApiProperty()
  platform: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  order: number;
}

export class CompanyProfileEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  companyDescription: string | null;

  @ApiProperty()
  address: string | null;

  @ApiProperty()
  phoneNumber: string | null;

  @ApiProperty()
  email: string | null;

  @ApiProperty()
  logoKey: string | null;

  @ApiProperty()
  footerLogoKey: string | null;

  @ApiProperty()
  faviconKey: string | null;

  @ApiProperty()
  whatsappNumber: string | null;

  @ApiProperty()
  googleMap: string | null;

  @ApiProperty({ type: [SocialMediaEntity] })
  socialMedia: SocialMediaEntity[] | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: CompanyProfileSeoMetaEntity })
  seoMeta: CompanyProfileSeoMetaEntity | null;

  constructor(partial: Partial<CompanyProfileEntity>) {
    Object.assign(this, partial);
  }
}
