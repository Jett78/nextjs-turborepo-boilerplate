"use server";

import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import type { Testimonial } from "@/types/testimonial";

interface TestimonialsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Testimonial[];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await apiClient<TestimonialsApiResponse>(
      `${API_ROUTES.TESTIMONIAL}?sortBy=sortOrder&sortOrder=asc`,
      { next: { tags: ["testimonials"] } }
    );

    if (!response || !response.success || !response.data) return [];
    return response.data || [];
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}
