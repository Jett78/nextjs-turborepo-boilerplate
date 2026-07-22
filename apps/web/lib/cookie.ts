import Cookies from "js-cookie";

const TOKEN_COOKIE_NAME = "admin_token";

export function setAuthToken(token: string): void {
  Cookies.set(TOKEN_COOKIE_NAME, token, {
    expires: 7,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export function getAuthToken(): string | undefined {
  return Cookies.get(TOKEN_COOKIE_NAME);
}

export function removeAuthToken(): void {
  Cookies.remove(TOKEN_COOKIE_NAME, { path: "/" });
}
