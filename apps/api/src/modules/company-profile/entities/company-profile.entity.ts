import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ required: false })
  primaryColor: string | null;

  @ApiProperty({ required: false })
  secondaryColor: string | null;

  @ApiProperty({ type: [SocialMediaEntity] })
  socialMedia: SocialMediaEntity[] | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<CompanyProfileEntity>) {
    Object.assign(this, partial);
  }
}
