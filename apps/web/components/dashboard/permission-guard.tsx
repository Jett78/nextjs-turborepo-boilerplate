"use client";

import { useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";

const routePermissions: Record<string, string[]> = {
  "/dashboard/blogs": ["blog.read", "blog.create", "blog.edit", "blog.delete"],
  "/dashboard/services": ["service.read", "service.create", "service.edit", "service.delete"],
  "/dashboard/testimonials": ["testimonial.read", "testimonial.create", "testimonial.edit", "testimonial.delete"],
  "/dashboard/team": ["team.read", "team.create", "team.edit", "team.delete"],
  "/dashboard/faqs": ["faq.read", "faq.create", "faq.edit", "faq.delete"],
  "/dashboard/inquiries": ["inquiry.read", "inquiry.delete"],
  "/dashboard/users": ["user.read", "user.create", "user.edit", "user.delete"],
  "/dashboard/role-permissions": ["permission.read", "permission.edit"],
  "/dashboard/seo": ["seo.read", "seo.edit"],
  "/dashboard/page-seo": ["page_seo.read", "page_seo.create", "page_seo.edit", "page_seo.delete"],
  "/dashboard/redirects": ["redirect.read", "redirect.create", "redirect.edit", "redirect.delete"],
  "/dashboard/payment-settings": ["payment_settings.read", "payment_settings.edit"],
  "/dashboard/company-profile": ["company_profile.read", "company_profile.edit"],
  "/dashboard/domains": ["domain.read", "domain.create", "domain.edit", "domain.delete"],
};

function getRequiredPermissions(pathname: string): string[] | null {
  for (const [route, permissions] of Object.entries(routePermissions)) {
    if (pathname.startsWith(route)) {
      return permissions;
    }
  }
  return null;
}

export function PermissionGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { getAll: getProfile } = useCrud<{ role: string }>({
    endpoint: API_ROUTES.AUTH_PROFILE,
    queryKey: "profile",
    isAuthenticated: true,
  });

  const { getAll: getPermissions } = useCrud<string[]>({
    endpoint: `${API_ROUTES.PERMISSION}/me`,
    queryKey: "user-permissions",
    isAuthenticated: true,
  });

  const { data: profile, isLoading: profileLoading } = getProfile();
  const { data: permissions, isLoading: permissionsLoading } = getPermissions();

  const role = profile?.role ?? "";
  const loading = profileLoading || permissionsLoading;

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (role === "super_admin") return true;
      if (permissions && permissions.includes("__all__")) return true;
      if (permissions && permissions.includes(permission)) return true;
      return false;
    },
    [permissions, role]
  );

  useEffect(() => {
    if (loading) return;

    const requiredPermissions = getRequiredPermissions(pathname);

    if (!requiredPermissions) return;

    if (requiredPermissions.includes("__super_admin_only__")) {
      if (role !== "super_admin") {
        router.replace("/dashboard");
      }
      return;
    }

    const hasAccess = requiredPermissions.some((p) => hasPermission(p));

    if (!hasAccess) {
      router.replace("/dashboard");
    }
  }, [pathname, role, hasPermission, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const requiredPermissions = getRequiredPermissions(pathname);

  if (requiredPermissions) {
    if (requiredPermissions.includes("__super_admin_only__")) {
      if (role !== "super_admin") return null;
    } else {
      const hasAccess = requiredPermissions.some((p) => hasPermission(p));
      if (!hasAccess) return null;
    }
  }

  return <>{children}</>;
}
