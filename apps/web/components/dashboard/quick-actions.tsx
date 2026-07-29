"use client";

import Link from "next/link";
import {
  FileText,
  MessageSquare,
  HelpCircle,
  Globe,
  Users,
  Settings,
  Plus,
} from "lucide-react";

const actions = [
  {
    label: "New Blog Post",
    href: "/dashboard/blogs/new",
    icon: FileText,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "Add Testimonial",
    href: "/dashboard/testimonials/new",
    icon: MessageSquare,
    color: "text-purple-600 bg-purple-50",
  },
  {
    label: "Add FAQ",
    href: "/dashboard/faqs/new",
    icon: HelpCircle,
    color: "text-amber-600 bg-amber-50",
  },
  {
    label: "SEO Settings",
    href: "/dashboard/seo",
    icon: Globe,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "Manage Users",
    href: "/dashboard/users",
    icon: Users,
    color: "text-rose-600 bg-rose-50",
  },
  {
    label: "Company Profile",
    href: "/dashboard/company-profile",
    icon: Settings,
    color: "text-slate-600 bg-slate-50",
  },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
        <Plus className="h-4 w-4 text-slate-400" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-200"
          >
            <div className={`rounded-md p-2 ${action.color}`}>
              <action.icon className="h-4 w-4" />
            </div>
            <span>{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
