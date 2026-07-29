"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Settings, Shield, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";
import { showSuccess } from "@/lib/toast-helper";
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

const navItems = [
  { name: "Profile", href: "/profile/user", icon: User },
  { name: "Account Settings", href: "/profile/user/settings", icon: Settings },
  { name: "Security", href: "/profile/user/security", icon: Shield },
];

export function ProfileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/profile/user") return pathname === "/profile/user";
    return pathname.startsWith(href);
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
    <nav className="bg-white rounded-2xl border border-slate-200 p-3">
      <div className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
              isActive(item.href)
                ? "bg-primarymain text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <item.icon className="size-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 w-full">
              <LogOut className="size-5" />
              <span>Logout</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to logout? You will need to log in again
                to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-rose-500 hover:bg-rose-600"
              >
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </nav>
  );
}
