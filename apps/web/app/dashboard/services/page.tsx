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
import { revalidateServices } from "@/actions/revalidate-action";
import type { Service } from "@/types/service";

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { getAll } = useCrud<Service>({
    endpoint: API_ROUTES.SERVICE,
    queryKey: "services",
  });

  const { data, isLoading, isError, error } = getAll({ take: 50 });

  const services = (data as Service[]) || [];

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (s.shortDescription && s.shortDescription.toLowerCase().includes(debouncedSearch.toLowerCase()))
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const columns: Column<Service>[] = [
    {
      key: "sortOrder",
      label: "Order",
      render: (row) => (
        <span className="font-bold text-slate-900">{row.sortOrder}</span>
      ),
    },
    {
      key: "name",
      label: "Service",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.imageKey && (
            <img
              src={row.imageKey}
              alt={row.name}
              className="h-10 w-10 rounded-lg object-cover"
            />
          )}
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 leading-none">
              {row.name}
            </span>
            {row.shortDescription && (
              <span className="text-[10px] text-slate-400 font-medium mt-1 max-w-xs truncate">
                {row.shortDescription}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (row) => (
        <div className="flex flex-col">
          {row.offerPrice ? (
            <>
              <span className="text-xs text-slate-400 line-through">{formatPrice(row.price)}</span>
              <span className="text-sm font-bold text-green-600">{formatPrice(row.offerPrice)}</span>
            </>
          ) : row.price ? (
            <span className="text-sm font-bold text-slate-900">{formatPrice(row.price)}</span>
          ) : (
            <span className="text-xs text-slate-400">-</span>
          )}
        </div>
      ),
    },
    {
      key: "features",
      label: "Features",
      render: (row) => (
        <span className="text-xs text-slate-600">
          {row.features?.length || 0} items
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold ${
            row.isActive
              ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
              : "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/20"
          }`}
        >
          {row.isActive ? "Active" : "Draft"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <EditButton href={`/dashboard/services/${row.id}/edit`} />
          <DeleteButton
            id={row.id}
            endpoint={API_ROUTES.SERVICE}
            queryKey="services"
            entityName="service"
            onSuccess={revalidateServices}
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
        title="Services"
        description="Manage your services and pricing."
        path="services"
      />
      <div className="relative w-full shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input
          placeholder="Search by name or description..."
          className="pl-10 h-11 bg-white border-slate-200 rounded-md focus:ring-primary/20 focus:border-primary transition-all font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredServices}
        isLoading={isLoading}
        className="shadow-2xl shadow-slate-200/40"
      />
    </div>
  );
}
