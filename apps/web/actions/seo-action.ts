"use server";

import { API_ROUTES } from "@/config/api-routes";
import type { GlobalSeo, GlobalSeoResponse } from "@/types/seo";

export async function getSeoSettings(): Promise<GlobalSeo | null> {
  try {
    const response = await fetch(API_ROUTES.SEO, {
      headers: { "Content-Type": "application/json" },
      next: { tags: ["seo"] },
    });

    if (!response.ok) return null;

    const data: GlobalSeoResponse = await response.json();
    if (data?.success && data.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function getPublicSeoSettings(): Promise<Partial<GlobalSeo> | null> {
  try {
    const response = await fetch(API_ROUTES.SEO, {
      headers: { "Content-Type": "application/json" },
      next: { tags: ["seo"] },
    });

    if (!response.ok) return null;

    const data: GlobalSeoResponse = await response.json();
    if (data?.success && data.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}
