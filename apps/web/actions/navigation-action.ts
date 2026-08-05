"use server";

import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import type { NavigationItem } from "@/types/navigation";

interface NavigationApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: NavigationItem[];
}

export async function getNavigationItems(): Promise<NavigationItem[]> {
  try {
    const response = await apiClient<NavigationApiResponse>(
      `${API_ROUTES.NAVIGATION}?isActive=true&sortBy=sortOrder&sortOrder=asc`,
      { next: { tags: ["navigation"] } }
    );

    if (!response || !response.success || !response.data) return [];
    return response.data || [];
  } catch (error) {
    console.error("Error fetching navigation items:", error);
    return [];
  }
}
