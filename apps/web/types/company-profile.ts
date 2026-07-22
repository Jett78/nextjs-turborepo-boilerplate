import { CommonResponse } from "./base-entity";

export interface SocialMedia {
  platform: string;
  url: string;
  order: number;
}

export interface CompanyProfileSeoMeta {
  id: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  metaRobots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageKey?: string;
  createdAt: Date;
  updatedAt: Date;
  companyProfileId?: string;
}

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
  socialMedia?: SocialMedia[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  seoMeta?: CompanyProfileSeoMeta;
}

export type CompanyProfileResponse = CommonResponse<CompanyProfile>;
