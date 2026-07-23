"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href?: string;
  icon: any;
  children?: { name: string; href: string; icon: any }[];
}

const navigation: NavItem[] = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Content",
    icon: FileText,
    children: [
      { name: "Blogs", href: "/dashboard/blogs", icon: FileText },
      { name: "Testimonials", href: "/dashboard/testimonials", icon: Star },
    ],
  },
  { name: "Inquiries", href: "/dashboard/inquiries", icon: MessageSquare },
  {
    name: "Settings",
    icon: Building2,
    children: [
      {
        name: "Company Profile",
        href: "/dashboard/company-profile",
        icon: Building2,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isPathActive = (path?: string) => {
    if (!path) return false;
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  const isAnyChildActive = (children?: { href: string }[]) => {
    if (!children) return false;
    return children.some((child) => isPathActive(child.href));
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 relative group/sidebar">
      <div className="p-6 overflow-hidden">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-xl text-white whitespace-nowrap"
        >
          <div className="size-7 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white text-lg">A</span>
          </div>
          <span className="opacity-100 transition-opacity duration-300">
            Acme
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navigation.map((item) => {
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
        <button className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors overflow-hidden">
          <LogOut className="size-5 shrink-0" />
          <span className="truncate opacity-100 transition-opacity duration-300">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}
