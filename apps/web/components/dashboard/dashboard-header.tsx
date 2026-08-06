"use client";

import { Bell, Menu } from "lucide-react";
import Link from "next/link";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import { User } from "@/types/user";
import Image from "next/image";

interface HeaderProps {
  onToggleSidebar: () => void;
}



export function Header({ onToggleSidebar }: HeaderProps) {
  const { getAll } = useCrud<User>({
    endpoint: `${API_ROUTES.AUTH}/profile`,
    queryKey: "admin-profile",
    isAuthenticated: true,
  });

  const { data: profile } = getAll();
  const profileData = profile as User | undefined;

  const getInitials = (name?: string) => {
    if (!name) return "AU";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = profileData?.name || "Admin User";
  const displayRole = profileData?.role?.replace("_", " ") || "Super Admin";
  const initials = getInitials(profileData?.name);

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      <button
        onClick={onToggleSidebar}
        className="p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors active:scale-95"
        title="Toggle Sidebar"
      >
        <Menu className="size-6" />
      </button>

      <div className="flex items-center gap-4">
        <button
          className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 bg-secondary rounded-full border-2 border-white" />
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1" />

        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 p-1 pl-2 hover:bg-slate-50 rounded-full transition-colors group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">
              {displayName}
            </p>
            <p className="text-xs text-slate-500 mt-1 capitalize">{displayRole}</p>
          </div>
          {profileData?.image ? (
            <Image
              src={profileData.image}
              alt={displayName}
              height={500}
              width={500}
              className="size-9 rounded-full object-cover border border-slate-300"
            />
          ) : (
            <div className="size-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold border border-slate-300">
              {initials}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
