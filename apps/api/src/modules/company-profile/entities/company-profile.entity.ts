import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ required: false })
  facebookUrl: string | null;

  @ApiProperty({ required: false })
  instagramUrl: string | null;

  @ApiProperty({ required: false })
  tiktokUrl: string | null;

  @ApiProperty({ required: false })
  twitterUrl: string | null;

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
