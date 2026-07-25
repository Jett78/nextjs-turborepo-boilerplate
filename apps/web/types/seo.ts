import { CommonResponse } from "./base-entity";

export interface GlobalSeo {
  id: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImageKey?: string;
  gtmContainerId?: string;
  googleSearchConsoleVerification?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicSeo {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImageKey?: string;
  gtmContainerId?: string;
  googleSearchConsoleVerification?: string;
}

export type GlobalSeoResponse = CommonResponse<GlobalSeo>;
