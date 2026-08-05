import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

let cachedRedirects: { fromPath: string; toPath: string; statusCode: number }[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 1000;

async function getRedirects() {
  const now = Date.now();
  if (cachedRedirects && now - lastFetchTime < CACHE_TTL) {
    return cachedRedirects;
  }

  try {
    const res = await fetch(`${API_URL}/redirects/all`, {
      cache: "no-store",
    });
    const data = await res.json();
    if (data.success && data.data) {
      cachedRedirects = data.data;
      lastFetchTime = now;
      return cachedRedirects;
    }
    return cachedRedirects || [];
  } catch {
    return cachedRedirects || [];
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const redirects = await getRedirects();
  const redirect = redirects?.find((r) => r.fromPath === pathname);

  if (redirect) {
    return NextResponse.redirect(new URL(redirect.toPath, request.url), {
      status: redirect.statusCode || 301,
      headers: {
        "X-Redirected-From": pathname,
      },
    });
  }

  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const userRole = request.cookies.get("user_role")?.value;
  const isAdmin = userRole === "admin" || userRole === "super_admin" || userRole === "editor" || userRole === "manager";

  const isAdminDashboard = pathname.startsWith("/dashboard");
  const isAdminLogin = pathname === "/admin";
  const isUserProfile = pathname.startsWith("/profile/user");
  const isUserLogin = pathname === "/login";
  const isUserRegister = pathname === "/register";

  if (isAdminDashboard && !sessionToken) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isUserProfile && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionToken && (isAdminLogin || isUserLogin || isUserRegister)) {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/profile/user", request.url));
    }
  }

  if (isAdminDashboard && sessionToken && !isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
