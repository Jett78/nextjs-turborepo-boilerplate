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
      `${API_ROUTES.NAVIGATION}?isActive=true&sortBy=sortOrder&sortOrder=asc&take=10`,
      { next: { tags: ["navigation"] } }
    );

    if (!response || !response.success || !response.data) return [];
    return response.data || [];
  } catch (error) {
    console.error("Error fetching navigation items:", error);
    return [];
  }
}

export async function getNavigationItemById(id: string): Promise<NavigationItem | null> {
  try {
    const response = await apiClient<{ data: NavigationItem }>(
      `${API_ROUTES.NAVIGATION}/${id}`,
      { next: { tags: [`navigation-${id}`] } }
    );

    if (!response || !response.data) return null;
    return response.data;
  } catch (error) {
    console.error("Error fetching navigation item:", error);
    return null;
  }
}
