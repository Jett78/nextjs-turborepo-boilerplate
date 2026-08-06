"use server";

import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import type { Redirect } from "@/types/redirect";

interface RedirectsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Redirect[];
}

export async function getRedirects(): Promise<Redirect[]> {
  try {
    const response = await apiClient<RedirectsApiResponse>(
      `${API_ROUTES.REDIRECT}?sortBy=sortOrder&sortOrder=asc&take=10`,
      { next: { tags: ["redirects"] } }
    );

    if (!response || !response.success || !response.data) return [];
    return response.data || [];
  } catch (error) {
    console.error("Error fetching redirects:", error);
    return [];
  }
}

export async function getRedirectById(id: string): Promise<Redirect | null> {
  try {
    const response = await apiClient<{ data: Redirect }>(
      `${API_ROUTES.REDIRECT}/${id}`,
      { next: { tags: [`redirect-${id}`] } }
    );

    if (!response || !response.data) return null;
    return response.data;
  } catch (error) {
    console.error("Error fetching redirect:", error);
    return null;
  }
}
