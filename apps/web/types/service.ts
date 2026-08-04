import { BaseEntity, PaginatedResponse, CommonResponse } from "./base-entity";

export interface Service extends BaseEntity {
  name: string;
  slug: string;
  imageKey?: string;
  gallery?: string[];
  shortDescription?: string;
  description?: string;
  price?: number;
  offerPrice?: number;
  features?: string[];
  isActive: boolean;
  sortOrder: number;
}

export interface ServicesApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Service[];
}

export interface ServiceApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Service;
}

export type ServiceListResponse = CommonResponse<PaginatedResponse<Service>>;
export type ServiceResponse = CommonResponse<Service>;
