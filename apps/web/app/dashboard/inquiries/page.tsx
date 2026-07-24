"use client";

import { useState, useEffect } from "react";
import DashboardHeading from "@/components/dashboard/dashboard-heading";
import DataTable, { Column } from "@/components/dashboard/data-table";
import { Search, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import { DeleteInquiryButton } from "@/components/dashboard/delete-inquiry-button";
import type { Inquiry } from "@/types/inquiry";

export default function InquiriesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { getAll } = useCrud<Inquiry>({
    endpoint: API_ROUTES.INQUIRY,
    queryKey: "inquiries",
    isAuthenticated: true,
  });

  const { data, isLoading, isError, error } = getAll({ take: 50 });

  const inquiries = (data as Inquiry[]) || [];

  const filteredInquiries = inquiries.filter(
    (i) =>
      i.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      i.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      i.message.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const columns: Column<Inquiry>[] = [
    {
      key: "name",
      label: "Contact",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm border border-slate-200">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 leading-none">
              {row.name}
            </span>
            <div className="flex items-center gap-1 mt-1">
              <Mail className="size-3 text-slate-400" />
              <span className="text-[10px] text-slate-400 font-medium">
                {row.email}
              </span>
            </div>
            {row.phone && (
              <div className="flex items-center gap-1 mt-0.5">
                <Phone className="size-3 text-slate-400" />
                <span className="text-[10px] text-slate-400 font-medium">
                  {row.phone}
                </span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "message",
      label: "Message",
      render: (row) => (
        <span className="text-xs text-slate-600 max-w-xs truncate block">
          {row.message}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row) => (
        <span className="text-xs font-medium text-slate-700">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <DeleteInquiryButton id={row.id} />
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <DashboardHeading
          title="Inquiries"
          description="Manage contact form submissions and messages."
        />
        <div className="relative w-full sm:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="Search by name, email or message..."
            className="pl-10 h-11 bg-white border-slate-200 rounded-md focus:ring-primary/20 focus:border-primary transition-all font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredInquiries}
        isLoading={isLoading}
        className="shadow-2xl shadow-slate-200/40"
      />
    </div>
  );
}
