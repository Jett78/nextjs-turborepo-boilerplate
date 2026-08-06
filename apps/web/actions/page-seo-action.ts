"use server";

import { cookies } from "next/headers";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import type { PageSeo, PageSeoResponse, PageSeoListResponse } from "@/types/page-seo";

export async function getPageSeoList(): Promise<PageSeo[]> {
  try {
    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get("better-auth.session_token")?.value ||
      cookieStore.get("__Secure-better-auth.session_token")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (sessionToken) {
      headers["Cookie"] = `better-auth.session_token=${sessionToken}`;
    }

    const response = await fetch(API_ROUTES.PAGE_SEO, { headers });
    if (!response.ok) return [];

    const data: PageSeoListResponse = await response.json();
    if (data?.success && data.data) {
      return data.data;
    }
    return [];
  } catch (error) {
    return [];
  }
}

export async function getPageSeoByPath(path: string): Promise<PageSeo | null> {
  try {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const response = await apiClient<{ data: PageSeo }>(
      `${API_ROUTES.PAGE_SEO}/${cleanPath}`,
      { next: { tags: [`page-seo-${cleanPath}`] } }
    );

    if (!response || !response.data) return null;
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function getPageSeoForMetadata(path: string) {
  const pageSeo = await getPageSeoByPath(path);

  if (!pageSeo) return null;

  return {
    metaTitle: pageSeo.metaTitle,
    metaDescription: pageSeo.metaDescription,
    ogTitle: pageSeo.ogTitle,
    ogDescription: pageSeo.ogDescription,
    ogImageKey: pageSeo.ogImageKey,
  };
}
