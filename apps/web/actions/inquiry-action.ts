"use server";

import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import type { CommonResponse } from "@/types/base-entity";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
}

export interface CreateInquiryDto {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function createInquiry(data: CreateInquiryDto): Promise<CommonResponse<Inquiry>> {
  const response = await apiClient<CommonResponse<Inquiry>>(API_ROUTES.INQUIRY, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
}
