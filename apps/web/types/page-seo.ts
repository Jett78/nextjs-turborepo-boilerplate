import { CommonResponse } from "./base-entity";

export interface PageSeo {
  id: string;
  pagePath: string;
  pageTitle?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PageSeoResponse = CommonResponse<PageSeo>;
export type PageSeoListResponse = CommonResponse<PageSeo[]>;
