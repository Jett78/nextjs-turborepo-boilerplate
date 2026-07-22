import { ApiError } from "@/types/base-entity";

export const TOKEN_TYPES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

interface RequestOptions extends RequestInit {
  isAuthenticated?: boolean;
  tokenType?: (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES];
  token?: string;
}

function getTokenFromCookies(): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }
  
  const match = document.cookie.match(/admin_token=([^;]+)/);
  return match ? match[1] : undefined;
}

export async function apiClient<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { isAuthenticated, token: explicitToken, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (isAuthenticated) {
    const token = explicitToken || getTokenFromCookies();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
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
