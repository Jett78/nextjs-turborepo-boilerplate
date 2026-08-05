"use client";

import { useState, useEffect } from "react";
import DashboardHeading from "@/components/dashboard/dashboard-heading";
import DataTable, { Column } from "@/components/dashboard/data-table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import { EditButton } from "@/components/dashboard/edit-button";
import type { NavigationItem } from "@/types/navigation";

export default function NavigationPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { getAll } = useCrud<NavigationItem>({
    endpoint: API_ROUTES.NAVIGATION,
    queryKey: "navigation",
  });

  const { data, isLoading, isError, error } = getAll({ take: 100 });

  const items = (data as NavigationItem[]) || [];

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.path.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.key.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const columns: Column<NavigationItem>[] = [
    {
      key: "sortOrder",
      label: "Order",
      render: (row) => (
        <span className="font-bold text-slate-900">{row.sortOrder}</span>
      ),
    },
    {
      key: "key",
      label: "Key",
      render: (row) => (
        <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
          {row.key}
        </span>
      ),
    },
    {
      key: "label",
      label: "Label",
      render: (row) => (
        <span className="font-bold text-slate-900">{row.label}</span>
      ),
    },
    {
      key: "path",
      label: "Path",
      render: (row) => (
        <span className="font-mono text-xs text-slate-600">{row.path}</span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
            row.isActive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <EditButton href={`/dashboard/navigation/${row.id}/edit`} />
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="p-8 text-center text-rose-600 font-bold">
        Error: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <DashboardHeading
        title="Navigation"
        description="Manage your website navigation links. Edit labels while routes stay fixed."
      />
      <div className="relative w-full shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input
          placeholder="Search by label, path, or key..."
          className="pl-10 h-11 bg-white border-slate-200 rounded-md focus:ring-primary/20 focus:border-primary transition-all font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredItems}
        isLoading={isLoading}
        className="shadow-2xl shadow-slate-200/40"
      />
    </div>
  );
}
