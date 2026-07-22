"use server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName?: string;
      role: string;
    };
    token: string;
  };
}

export async function loginAction(
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data: LoginResponse = await response.json();

    if (!response.ok || !data.success) {
      return { success: false, error: data.message || "Login failed" };
    }

    return { success: true, token: data.data.token };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An error occurred during login" };
  }
}

export async function logoutAction(): Promise<void> {
  // Cookie is cleared client-side
}
