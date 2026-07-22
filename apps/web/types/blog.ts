import { BaseEntity, PaginatedResponse, CommonResponse } from "./base-entity";

export interface SeoMeta {
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
  blogId?: string;
}

export interface Blog extends BaseEntity {
  title: string;
  slug: string;
  imageKey?: string;
  description?: string;
  isActive: boolean;
  seoMeta?: SeoMeta;
}

export type BlogListResponse = CommonResponse<PaginatedResponse<Blog>>;
export type BlogResponse = CommonResponse<Blog>;
