"use client";

import { useState, useEffect } from "react";
import DashboardHeading from "@/components/dashboard/dashboard-heading";
import DataTable, { Column } from "@/components/dashboard/data-table";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { EditButton } from "@/components/dashboard/edit-button";
import { revalidateRedirects } from "@/actions/redirect-action";
import type { Redirect } from "@/types/redirect";

export default function RedirectsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { getAll } = useCrud<Redirect>({
    endpoint: API_ROUTES.REDIRECT,
    queryKey: "redirects",
    isAuthenticated: true,
  });

  const { data, isLoading, isError, error } = getAll({ take: 50 });

  const redirects = (data as Redirect[]) || [];

  const filteredRedirects = redirects.filter(
    (r) =>
      r.fromPath.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      r.toPath.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const columns: Column<Redirect>[] = [
    {
      key: "fromPath",
      label: "From",
      render: (row) => (
        <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
          {row.fromPath}
        </span>
      ),
    },
    {
      key: "toPath",
      label: "To",
      render: (row) => (
        <div className="flex items-center gap-2">
          <ArrowRight className="size-4 text-slate-400" />
          <span className="font-mono text-sm bg-green-50 text-green-700 px-2 py-1 rounded">
            {row.toPath}
          </span>
        </div>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.isActive
              ? "bg-green-100 text-green-800"
              : "bg-slate-100 text-slate-800"
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
          <EditButton href={`/dashboard/redirects/${row.id}/edit`} />
          <DeleteButton
            id={row.id}
            endpoint={API_ROUTES.REDIRECT}
            queryKey="redirects"
            entityName="redirect"
            onSuccess={revalidateRedirects}
          />
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
        title="Redirects"
        description="Manage URL redirects for SEO preservation."
        path="redirects"
      />

      <div className="relative w-full shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input
          placeholder="Search by path..."
          className="pl-10 h-11 bg-white border-slate-200 rounded-md focus:ring-primary/20 focus:border-primary transition-all font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredRedirects}
        isLoading={isLoading}
        className="shadow-2xl shadow-slate-200/40"
      />
    </div>
  );
}
