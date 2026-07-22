import { BaseEntity, PaginatedResponse, CommonResponse } from "./base-entity";

export interface Testimonial extends BaseEntity {
  name: string;
  message: string;
  avatar?: string;
  designation?: string;
  sortOrder: number;
}

export type TestimonialListResponse = CommonResponse<PaginatedResponse<Testimonial>>;
export type TestimonialResponse = CommonResponse<Testimonial>;
