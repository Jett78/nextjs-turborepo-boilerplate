import { ApiError } from "@/types/base-entity";

interface RequestOptions extends RequestInit {
  isAuthenticated?: boolean;
}

export async function apiClient<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { isAuthenticated, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: ApiError = {
      success: false,
      statusCode: response.status,
      message: errorData.message || `HTTP error ${response.status}`,
      errors: errorData.errors,
    };
    throw error;
  }

  return response.json();
}
