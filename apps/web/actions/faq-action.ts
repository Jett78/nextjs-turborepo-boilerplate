"use server";

import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import type { Faq } from "@/types/faq";

interface FaqsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Faq[];
}

export async function getFaqs(): Promise<Faq[]> {
  try {
    const response = await apiClient<FaqsApiResponse>(
      `${API_ROUTES.FAQ}?sortBy=sortOrder&sortOrder=asc&isActive=true&take=10`,
      { next: { tags: ["faqs"] } }
    );

    if (!response || !response.success || !response.data) return [];
    return response.data || [];
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}

export async function getFaqById(id: string): Promise<Faq | null> {
  try {
    const response = await apiClient<{ data: Faq }>(
      `${API_ROUTES.FAQ}/${id}`,
      { next: { tags: [`faq-${id}`] } }
    );

    if (!response || !response.data) return null;
    return response.data;
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return null;
  }
}
