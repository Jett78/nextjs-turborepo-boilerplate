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
      `${API_ROUTES.TESTIMONIAL}?sortBy=sortOrder&sortOrder=asc&take=10`,
      { next: { tags: ["testimonials"] } }
    );

    if (!response || !response.success || !response.data) return [];
    return response.data || [];
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  try {
    const response = await apiClient<{ data: Testimonial }>(
      `${API_ROUTES.TESTIMONIAL}/${id}`,
      { next: { tags: [`testimonial-${id}`] } }
    );

    if (!response || !response.data) return null;
    return response.data;
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return null;
  }
}
