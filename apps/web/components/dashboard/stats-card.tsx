import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  isLoading?: boolean;
}

export function StatsCard({ label, value, icon: Icon, isLoading }: StatsCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-md border border-slate-200 shadow-xs animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-slate-200 rounded-lg size-10" />
        </div>
        <div>
          <div className="h-4 bg-slate-200 rounded w-20 mb-2" />
          <div className="h-6 bg-slate-200 rounded w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-md border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="size-6 text-primary" />
        </div>
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <h3 className="text-lg font-bold text-slate-900 mt-1">{value}</h3>
      </div>
    </div>
  );
}
