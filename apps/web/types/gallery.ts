import { BaseEntity, PaginatedResponse, CommonResponse } from "./base-entity";

export interface Gallery extends BaseEntity {
  title: string;
  slug: string;
  description?: string;
  images: string[];
  category: string;
  tags?: string[];
  isActive: boolean;
  sortOrder: number;
}

export interface GalleryApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Gallery[];
}

export interface GalleryItemApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Gallery;
}

export type GalleryListResponse = CommonResponse<PaginatedResponse<Gallery>>;
export type GalleryResponse = CommonResponse<Gallery>;

export const GALLERY_CATEGORIES = [
  { value: "portfolio", label: "Portfolio" },
  { value: "team", label: "Team" },
  { value: "events", label: "Events" },
  { value: "behind_the_scenes", label: "Behind the Scenes" },
  { value: "testimonials", label: "Testimonials" },
  { value: "other", label: "Other" },
] as const;
