"use server";

import { apiClient } from "@/lib/api-client";
import type { CompanyProfile, CompanyProfileResponse } from "@/types/company-profile";

export async function getCompanyProfile(): Promise<CompanyProfile | null> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const response = await apiClient<CompanyProfileResponse>(
      `${API_BASE_URL}/company-profile`,
      { next: { tags: ["company-profile"] } }
    );

    if (!response || !response.success || !response.data) return null;
    return response.data;
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return null;
  }
}
