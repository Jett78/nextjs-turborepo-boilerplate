"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar-navigation";
import { Header } from "@/components/dashboard/dashboard-header";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  const SIDEBAR_WIDTH = "275px";

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    setIsMounted(true);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    } else {
      const savedState = localStorage.getItem("dashboard-sidebar-open");
      if (savedState !== null) {
        setIsOpen(savedState === "true");
      }
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (window.innerWidth >= 1024) {
      localStorage.setItem("dashboard-sidebar-open", String(newState));
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 lg:relative lg:block shrink-0 h-full overflow-hidden transition-all duration-300 ease-in-out border-r border-slate-800 bg-slate-900 shadow-2xl lg:shadow-none",
          isOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full lg:translate-x-0 opacity-0 lg:opacity-0"
        )}
        style={{
          width: isOpen
            ? window.innerWidth < 1024
              ? "280px"
              : SIDEBAR_WIDTH
            : "0px",
        }}
      >
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-hide">
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
