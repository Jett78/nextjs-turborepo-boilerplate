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
      `${API_ROUTES.FAQ}?sortBy=sortOrder&sortOrder=asc&isActive=true`,
      { next: { tags: ["faqs"] } }
    );

    if (!response || !response.success || !response.data) return [];
    return response.data || [];
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}
