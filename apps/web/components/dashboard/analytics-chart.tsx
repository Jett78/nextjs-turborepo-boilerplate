"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";

const monthlyData = [
  { name: "Jan", revenue: 4000, orders: 24, users: 12 },
  { name: "Feb", revenue: 3000, orders: 18, users: 8 },
  { name: "Mar", revenue: 5000, orders: 32, users: 15 },
  { name: "Apr", revenue: 4500, orders: 28, users: 11 },
  { name: "May", revenue: 6000, orders: 38, users: 20 },
  { name: "Jun", revenue: 5500, orders: 35, users: 18 },
];

const weeklyData = [
  { name: "Week 1", revenue: 1200, orders: 8, users: 3 },
  { name: "Week 2", revenue: 1800, orders: 12, users: 5 },
  { name: "Week 3", revenue: 1500, orders: 10, users: 4 },
  { name: "Week 4", revenue: 2000, orders: 15, users: 7 },
];

export function AnalyticsChart() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");
  const data = period === "weekly" ? weeklyData : monthlyData;
  const maxValue = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="bg-white p-6 rounded-md border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-5 text-primary" />
          <h3 className="font-bold text-sm text-slate-900">Analytics Overview</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPeriod("weekly")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              period === "weekly"
                ? "bg-primary text-primary-foreground"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setPeriod("monthly")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              period === "monthly"
                ? "bg-primary text-primary-foreground"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="h-64 flex items-end gap-3 px-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex-1 flex flex-col items-center gap-2">
            <div className="text-xs font-bold text-slate-700">
              ${(item.revenue / 1000).toFixed(1)}k
            </div>
            <div
              className="w-full bg-primary rounded-t-md transition-all duration-500 hover:bg-primary/80"
              style={{
                height: `${(item.revenue / maxValue) * 200}px`,
                animationDelay: `${index * 100}ms`,
              }}
            />
            <div className="text-xs text-slate-500 font-medium">{item.name}</div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
        <div className="text-center">
          <p className="text-xs text-slate-500 font-medium">Total Revenue</p>
          <p className="text-lg font-bold text-primary mt-1">
            ${data.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500 font-medium">Total Orders</p>
          <p className="text-lg font-bold text-emerald-600 mt-1">
            {data.reduce((sum, d) => sum + d.orders, 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500 font-medium">New Users</p>
          <p className="text-lg font-bold text-amber-600 mt-1">
            {data.reduce((sum, d) => sum + d.users, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
