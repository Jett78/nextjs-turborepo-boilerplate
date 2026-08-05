"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Star,
  Building2,
  LogOut,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Search,
  FileCode,
  Users,
  HelpCircle,
  CreditCard,
  Globe,
  UsersRound,
  Briefcase,
  ArrowRightLeft,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";
import { showSuccess } from "@/lib/toast-helper";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { LucideIcon } from "lucide-react";

interface NavItem {
  name: string;
  href?: string;
  icon: LucideIcon;
  permission?: string;
  permissions?: string[];
  children?: {
    name: string;
    href: string;
    icon: LucideIcon;
    permission?: string;
  }[];
}

const navigation: NavItem[] = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard.view_stats" },
  { name: "Domains", href: "/dashboard/domains", icon: Globe, permission: "domain.read" },
  {
    name: "Content",
    icon: FileText,
    permissions: ["blog.read", "testimonial.read", "team.read", "service.read", "faq.read"],
    children: [
      { name: "Blogs", href: "/dashboard/blogs", icon: FileText, permission: "blog.read" },
      { name: "Testimonials", href: "/dashboard/testimonials", icon: Star, permission: "testimonial.read" },
      { name: "Team", href: "/dashboard/team", icon: UsersRound, permission: "team.read" },
      { name: "Services", href: "/dashboard/services", icon: Briefcase, permission: "service.read" },
      { name: "FAQs", href: "/dashboard/faqs", icon: HelpCircle, permission: "faq.read" },
    ],
  },
  { name: "Inquiries", href: "/dashboard/inquiries", icon: MessageSquare, permission: "inquiry.read" },
  { name: "Users", href: "/dashboard/users", icon: Users, permission: "user.read" },
  { name: "Role Permissions", href: "/dashboard/role-permissions", icon: Shield },
  {
    name: "SEO",
    icon: Search,
    permissions: ["seo.read", "page_seo.read", "redirect.read"],
    children: [
      {
        name: "SEO & Analytics",
        href: "/dashboard/seo",
        icon: Search,
        permission: "seo.read",
      },
      {
        name: "Page SEO",
        href: "/dashboard/page-seo",
        icon: FileCode,
        permission: "page_seo.read",
      },
      {
        name: "Redirects",
        href: "/dashboard/redirects",
        icon: ArrowRightLeft,
        permission: "redirect.read",
      },
    ],
  },
  { name: "Payment Settings", href: "/dashboard/payment-settings", icon: CreditCard, permission: "payment_settings.read" },
  {
    name: "Settings",
    icon: Building2,
    permissions: ["company_profile.read"],
    children: [
      {
        name: "Company Profile",
        href: "/dashboard/company-profile",
        icon: Building2,
        permission: "company_profile.read",
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
  const permissionsLoadingState = profileLoading || permissionsLoading;

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (role === "super_admin") return true;
      if (permissions && permissions.includes("__all__")) return true;
      if (permissions && permissions.includes(permission)) return true;
      return false;
    },
    [permissions, role]
  );

  const hasAnyPermission = useCallback(
    (permissionList: string[]): boolean => {
      if (role === "super_admin") return true;
      if (permissions && permissions.includes("__all__")) return true;
      return permissionList.some((p) => permissions?.includes(p));
    },
    [permissions, role]
  );

  const filteredNavigation = useMemo(() => {
    if (permissionsLoadingState) return navigation;
    if (role === "super_admin") return navigation;

    return navigation
      .map((item) => {
        if (item.name === "Role Permissions") {
          return role === "super_admin" ? item : null;
        }

        if (item.children) {
          const filteredChildren = item.children.filter((child) =>
            child.permission ? hasPermission(child.permission) : true
          );

          if (filteredChildren.length === 0) return null;

          return { ...item, children: filteredChildren };
        }

        if (item.permission && !hasPermission(item.permission)) return null;

        return item;
      })
      .filter(Boolean) as NavItem[];
  }, [role, permissionsLoadingState, hasPermission, hasAnyPermission]);

  const isPathActive = (path?: string) => {
    if (!path) return false;
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  const isAnyChildActive = (children?: { href: string }[]) => {
    if (!children) return false;
    return children.some((child) => isPathActive(child.href));
  };

  const handleLogout = async () => {
    await signOut();

    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    }

    showSuccess("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 relative group/sidebar">
      <div className="p-6 overflow-hidden">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-xl text-white whitespace-nowrap"
        >
          <span className="opacity-100 text-center transition-opacity duration-300">
            Dashboard
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {filteredNavigation.map((item) => {
          const hasChildren = !!item.children;
          const isActive = isPathActive(item.href);
          const isChildActive = isAnyChildActive(item.children);
          const isDropdownOpen = openDropdown === item.name;

          if (hasChildren) {
            return (
              <div key={item.name}>
                <button
                  onClick={() =>
                    setOpenDropdown(isDropdownOpen ? null : item.name)
                  }
                  className={cn(
                    "flex w-full items-center gap-3 p-3 text-sm font-medium rounded-lg transition-colors",
                    isChildActive
                      ? "bg-primarymain text-white"
                      : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-5 shrink-0",
                      isChildActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-white"
                    )}
                  />
                  <span className="truncate opacity-100 transition-opacity duration-300">
                    {item.name}
                  </span>
                  <span className="ml-auto">
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 transition-transform duration-200",
                        isDropdownOpen && "rotate-180"
                      )}
                    />
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="my-1 ml-4 space-y-1">
                    {item.children?.map((child) => {
                      const isChildItemActive = isPathActive(child.href);
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                            isChildItemActive
                              ? "bg-primarymain/20 text-primarymain"
                              : "text-slate-400 hover:bg-slate-800 hover:text-white"
                          )}
                        >
                          <child.icon className="size-4 shrink-0" />
                          <span className="truncate">{child.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href!}
              className={cn(
                "flex items-center justify-between p-3 text-sm font-medium rounded-lg transition-colors group",
                isActive
                  ? "bg-primarymain text-white"
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <item.icon
                  className={cn(
                    "size-5 shrink-0",
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  )}
                />
                <span className="truncate opacity-100 transition-opacity duration-300">
                  {item.name}
                </span>
              </div>
              {isActive && <ChevronRight className="size-4 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors overflow-hidden"
        >
          <ExternalLink className="size-5 shrink-0" />
          <span className="truncate opacity-100 transition-opacity duration-300">
            View Site
          </span>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger render={<span className="block w-full" />}>
            <button className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors overflow-hidden">
              <LogOut className="size-5 shrink-0" />
              <span className="truncate opacity-100 transition-opacity duration-300">
                Logout
              </span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to logout? You will need to log in
                again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600"
              >
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
