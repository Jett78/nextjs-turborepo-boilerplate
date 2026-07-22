import Link from "next/link";
import { LogoutButton } from "@/components/dashboard/logout-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="text-xl font-bold">
            Dashboard
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard/blogs"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Blogs
            </Link>
            <Link
              href="/dashboard/company-profile"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Company Profile
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Back to Site
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
