import { BaseEntity, PaginatedResponse, CommonResponse } from "./base-entity";

export interface Inquiry extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export type InquiryListResponse = CommonResponse<PaginatedResponse<Inquiry>>;
export type InquiryResponse = CommonResponse<Inquiry>;
