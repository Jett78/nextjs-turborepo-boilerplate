import { BaseEntity, PaginatedResponse, CommonResponse } from "./base-entity";

export interface Faq extends BaseEntity {
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
}

export type FaqListResponse = CommonResponse<PaginatedResponse<Faq>>;
export type FaqResponse = CommonResponse<Faq>;
