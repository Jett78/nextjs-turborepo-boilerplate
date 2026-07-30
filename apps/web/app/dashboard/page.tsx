"use client";

import {
  Users,
  FileText,
  MessageSquare,
  Star,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";

interface DashboardStats {
  blogs: number;
  testimonials: number;
  inquiries: number;
  users: number;
}

export default function DashboardPage() {
  const { getAll } = useCrud<DashboardStats>({
    endpoint: API_ROUTES.DASHBOARD_STATS,
    queryKey: "dashboard-stats",
    isAuthenticated: true,
  });

  const { data } = getAll();
  const stats = data as DashboardStats | undefined;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1 text-xs">
          Welcome back! Here&apos;s what&apos;s happening with your site today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Total Blogs" value={stats?.blogs ?? 0} icon={FileText} />
        <StatsCard label="Testimonials" value={stats?.testimonials ?? 0} icon={Star} />
        <StatsCard label="Inquiries" value={stats?.inquiries ?? 0} icon={MessageSquare} />
        <StatsCard label="Total Users" value={stats?.users ?? 0} icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <AnalyticsChart />
        </div>

        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}