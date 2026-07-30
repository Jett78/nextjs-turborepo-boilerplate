import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const userRole = request.cookies.get("user_role")?.value;
  const isAdmin = userRole === "admin" || userRole === "super_admin";

  const isAdminDashboard = pathname.startsWith("/dashboard");
  const isAdminLogin = pathname === "/admin";
  const isUserProfile = pathname.startsWith("/profile/user");
  const isUserLogin = pathname === "/login";
  const isUserRegister = pathname === "/register";

  // Redirect unauthenticated to login
  if (isAdminDashboard && !sessionToken) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isUserProfile && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users from login/register pages
  if (sessionToken && (isAdminLogin || isUserLogin || isUserRegister)) {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/profile/user", request.url));
    }
  }

  // Prevent non-admin from accessing admin dashboard - redirect to admin login
  if (isAdminDashboard && sessionToken && !isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/user/:path*",
    "/login",
    "/register",
    "/admin",
  ],
};
