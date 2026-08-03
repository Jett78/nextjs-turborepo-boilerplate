"use server";

import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import type { Service, ServicesApiResponse, ServiceApiResponse } from "@/types/service";

export async function getServices(): Promise<Service[]> {
  try {
    const response = await apiClient<ServicesApiResponse>(
      `${API_ROUTES.SERVICE}?sortBy=sortOrder&sortOrder=asc`,
      { next: { tags: ["services"] } }
    );

    if (!response || !response.success || !response.data) return [];
    return response.data || [];
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const response = await apiClient<ServiceApiResponse>(
      `${API_ROUTES.SERVICE}/slug/${slug}`,
      { next: { tags: [`service-${slug}`] } }
    );

    if (!response || !response.success || !response.data) return null;
    return response.data || null;
  } catch (error) {
    console.error("Error fetching service:", error);
    return null;
  }
}
