"use server";

import { cookies } from "next/headers";
import { API_ROUTES } from "@/config/api-routes";
import type { GlobalSeo, GlobalSeoResponse } from "@/types/seo";

async function authFetch<T>(url: string): Promise<T | null> {
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

    const response = await fetch(url, { headers });

    if (!response.ok) return null;

    return response.json();
  } catch (error) {
    console.error("Auth fetch failed:", error);
    return null;
  }
}

export async function getSeoSettings(): Promise<GlobalSeo | null> {
  const response = await authFetch<GlobalSeoResponse>(API_ROUTES.SEO);

  if (response?.success && response.data) {
    return response.data;
  }

  return null;
}

export async function getPublicSeoSettings(): Promise<Partial<GlobalSeo> | null> {
  try {
    const response = await authFetch<GlobalSeoResponse>(API_ROUTES.SEO);

    if (response?.success && response.data) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch public SEO settings:", error);
    return null;
  }
}
