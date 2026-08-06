"use client";

import { useState } from "react";
import DashboardHeading from "@/components/dashboard/dashboard-heading";
import DataTable, { Column } from "@/components/dashboard/data-table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { EditButton } from "@/components/dashboard/edit-button";
import { revalidateFaqs } from "@/actions/revalidate-action";
import { useDebounce } from "@/hooks/useDebounce";
import type { Faq } from "@/types/faq";

export default function FaqsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { getAll } = useCrud<Faq>({
    endpoint: API_ROUTES.FAQ,
    queryKey: "faqs",
  });

  const { data, isLoading, isError, error } = getAll({ take: 50 });

  const faqs = (data as Faq[]) || [];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const columns: Column<Faq>[] = [
    {
      key: "sortOrder",
      label: "Order",
      render: (row) => (
        <span className="font-bold text-slate-900">{row.sortOrder}</span>
      ),
    },
    {
      key: "question",
      label: "Question",
      render: (row) => (
        <span className="font-bold text-slate-900">{row.question}</span>
      ),
    },
    {
      key: "answer",
      label: "Answer",
      render: (row) => (
        <span className="text-xs text-slate-600 max-w-xs truncate block">
          {row.answer}
        </span>
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
          <EditButton href={`/dashboard/faqs/${row.id}/edit`} />
          <DeleteButton
            id={row.id}
            endpoint={API_ROUTES.FAQ}
            queryKey="faqs"
            entityName="FAQ"
            onSuccess={revalidateFaqs}
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
        title="FAQs"
        description="Manage frequently asked questions."
        path="faqs"
      />
      <div className="relative w-full shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input
          placeholder="Search by question or answer..."
          className="pl-10 h-11 bg-white border-slate-200 rounded-md focus:ring-primary/20 focus:border-primary transition-all font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredFaqs}
        isLoading={isLoading}
        className="shadow-2xl shadow-slate-200/40"
      />
    </div>
  );
}
