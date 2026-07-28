"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  LogOut,
  ChevronRight,
  Settings,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";

interface NavItem {
  name: string;
  href?: string;
  icon: any;
  children?: { name: string; href: string; icon: any }[];
}

const navigation: NavItem[] = [
  { name: "Profile", href: "/profile/user", icon: User },
  { name: "Account Settings", href: "/profile/user/settings", icon: Settings },
  { name: "Security", href: "/profile/user/security", icon: Shield },
];

export function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isPathActive = (path?: string) => {
    if (!path) return false;
    if (path === "/profile/user") return pathname === "/profile/user";
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await signOut();
    
    // Clear all cookies
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    }
    
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 relative group/sidebar">
      <div className="p-6 overflow-hidden">
        <Link
          href="/profile/user"
          className="flex items-center gap-2 font-bold text-xl text-white whitespace-nowrap"
        >
          <div className="size-7 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white text-lg">A</span>
          </div>
          <span className="opacity-100 transition-opacity duration-300">
            Account
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navigation.map((item) => {
          const isActive = isPathActive(item.href);

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

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors overflow-hidden"
        >
          <LogOut className="size-5 shrink-0" />
          <span className="truncate opacity-100 transition-opacity duration-300">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}
