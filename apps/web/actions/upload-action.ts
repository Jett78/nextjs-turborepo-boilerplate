"use server";

import { cookies } from "next/headers";
import type { UploadResponse, UploadResult } from "@/types/upload";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function uploadSingleImage(
  formData: FormData
): Promise<UploadResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    const data: UploadResponse = await response.json();

    if (!response.ok || !data.success) {
      return { success: false, error: data.message || "Upload failed" };
    }

    return {
      success: true,
      data: {
        urls: { original: data.data.url },
        keys: { original: data.data.key },
      },
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Upload failed" };
  }
}
