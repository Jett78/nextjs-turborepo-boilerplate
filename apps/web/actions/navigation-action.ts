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

const DEFAULT_NAV_ITEMS: NavigationItem[] = [
  { id: "1", key: "home", label: "Home", path: "/", sortOrder: 1, isActive: true, createdAt: "", updatedAt: "" },
  { id: "2", key: "about", label: "About", path: "/about", sortOrder: 2, isActive: true, createdAt: "", updatedAt: "" },
  { id: "3", key: "services", label: "Services", path: "/services", sortOrder: 3, isActive: true, createdAt: "", updatedAt: "" },
  { id: "4", key: "blog", label: "Blog", path: "/blog", sortOrder: 4, isActive: true, createdAt: "", updatedAt: "" },
  { id: "5", key: "contact", label: "Contact", path: "/contact", sortOrder: 5, isActive: true, createdAt: "", updatedAt: "" },
];

export async function getNavigationItems(): Promise<NavigationItem[]> {
  try {
    const response = await apiClient<NavigationApiResponse>(
      `${API_ROUTES.NAVIGATION}?isActive=true&sortBy=sortOrder&sortOrder=asc&take=10`,
      { next: { tags: ["navigation"] } }
    );

    if (!response || !response.success || !response.data || response.data.length === 0) {
      return DEFAULT_NAV_ITEMS;
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching navigation items:", error);
    return DEFAULT_NAV_ITEMS;
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
