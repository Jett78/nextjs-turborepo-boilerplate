"use server";

import { cookies } from "next/headers";
import { API_ROUTES } from "@/config/api-routes";
import type { PageSeo, PageSeoResponse, PageSeoListResponse } from "@/types/page-seo";

async function authFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get("better-auth.session_token")?.value ||
      cookieStore.get("__Secure-better-auth.session_token")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string>),
    };
    if (sessionToken) {
      headers["Cookie"] = `better-auth.session_token=${sessionToken}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) return null;

    return response.json();
  } catch (error) {
    console.error("Auth fetch failed:", error);
    return null;
  }
}

export async function getPageSeoList(): Promise<PageSeo[]> {
  const response = await authFetch<PageSeoListResponse>(API_ROUTES.PAGE_SEO);
  if (response?.success && response.data) {
    return response.data;
  }
  return [];
}

export async function getPageSeoByPath(path: string): Promise<PageSeo | null> {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const response = await authFetch<PageSeoResponse>(`${API_ROUTES.PAGE_SEO}/${cleanPath}`);
  if (response?.success && response.data) {
    return response.data;
  }
  return null;
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
