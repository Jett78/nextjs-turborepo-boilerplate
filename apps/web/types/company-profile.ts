import { CommonResponse } from "./base-entity";

export interface CompanyProfile {
  id: string;
  companyName: string;
  companyDescription?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  logoKey?: string;
  footerLogoKey?: string;
  faviconKey?: string;
  whatsappNumber?: string;
  googleMap?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textForeground?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  twitterUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CompanyProfileResponse = CommonResponse<CompanyProfile>;
