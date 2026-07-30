"use client";

import { useState, useEffect } from "react";
import DashboardHeading from "@/components/dashboard/dashboard-heading";
import DataTable, { Column } from "@/components/dashboard/data-table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { EditButton } from "@/components/dashboard/edit-button";
import { revalidateTestimonials } from "@/actions/revalidate-action";
import type { Testimonial } from "@/types/testimonial";

export default function TestimonialsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { getAll } = useCrud<Testimonial>({
    endpoint: API_ROUTES.TESTIMONIAL,
    queryKey: "testimonials",
  });

  const { data, isLoading, isError, error } = getAll({ take: 50 });

  const testimonials = (data as Testimonial[]) || [];

  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      t.message.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const columns: Column<Testimonial>[] = [
    {
      key: "sortOrder",
      label: "Order",
      render: (row) => (
        <span className="font-bold text-slate-900">{row.sortOrder}</span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 leading-none">
              {row.name}
            </span>
            {row.designation && (
              <span className="text-[10px] text-slate-400 font-medium mt-1">
                {row.designation}
              </span>
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
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <EditButton href={`/dashboard/testimonials/${row.id}/edit`} />
          <DeleteButton
            id={row.id}
            endpoint={API_ROUTES.TESTIMONIAL}
            queryKey="testimonials"
            entityName="testimonial"
            onSuccess={revalidateTestimonials}
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
          title="Testimonials"
          description="Manage customer testimonials and reviews."
          path="testimonials"
        />
        <div className="relative w-full  shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="Search by name or message..."
            className="pl-10 h-11 bg-white border-slate-200 rounded-md focus:ring-primary/20 focus:border-primary transition-all font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      <DataTable
        columns={columns}
        data={filteredTestimonials}
        isLoading={isLoading}
        className="shadow-2xl shadow-slate-200/40"
      />
    </div>
  );
}
