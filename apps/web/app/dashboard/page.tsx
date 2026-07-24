"use client";

import {
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Star,
  Download,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ActivityTable } from "@/components/dashboard/activity-table";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1 text-xs">
          Welcome back! Here&apos;s what&apos;s happening with your site today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard label="Total Blogs" value="24" icon={FileText} />
        <StatsCard label="Testimonials" value="18" icon={Star} />
        <StatsCard label="Inquiries" value="142" icon={MessageSquare} />
        <StatsCard label="Page Views" value="12.4k" icon={Users} />
        <StatsCard label="Downloads" value="1.2k" icon={Download} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <AnalyticsChart />
        </div>

        <div>
          <ActivityTable />
        </div>
      </div>
    </div>
  );
}
