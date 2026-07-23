"use client";

import { Bell, Menu } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      <button
        onClick={onToggleSidebar}
        className="p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors active:scale-95"
        title="Toggle Sidebar"
      >
        <Menu className="size-6" />
      </button>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 bg-secondary rounded-full border-2 border-white" />
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1" />

        <button className="flex items-center gap-3 p-1 pl-2 hover:bg-slate-50 rounded-full transition-colors group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">
              Admin User
            </p>
            <p className="text-xs text-slate-500 mt-1">Super Admin</p>
          </div>
          <div className="size-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold border border-slate-300">
            AU
          </div>
        </button>
      </div>
    </header>
  );
}
