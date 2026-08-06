"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/components/ui/primary-button";
import FormField from "@/components/forms/form-field";
import { useCrud } from "@/hooks/useCRUD";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { API_ROUTES } from "@/config/api-routes";
import { revalidateNavigation } from "@/actions/revalidate-action";
import SubmittingLoader from "@/components/dashboard/submitting-loader";
import type { NavigationItem } from "@/types/navigation";

interface NavigationFormProps {
  item: NavigationItem;
}

export function NavigationForm({ item }: NavigationFormProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { put } = useCrud<Record<string, any>>({
    endpoint: API_ROUTES.NAVIGATION,
    queryKey: "navigation",
    isAuthenticated: true,
  });

  const [label, setLabel] = useState(item.label);
  const [sortOrder, setSortOrder] = useState(String(item.sortOrder));
  const [isActive, setIsActive] = useState(String(item.isActive));

  const isPending = put.isPending;

  const { onSuccess, onError } = useFormSubmit({
    entityName: "Navigation item",
    redirectPath: "/dashboard/navigation",
    entityId: item.id,
    revalidateAction: revalidateNavigation,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Record<string, any> = {
      label,
      sortOrder: parseInt(sortOrder, 10),
      isActive: isActive === "true",
    };

    put.mutate({ id: item.id, data: payload }, { onSuccess, onError });
  };

  if (!mounted) {
    return <div className="space-y-8 animate-pulse">
      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="h-4 bg-slate-200 rounded w-48"></div>
        <div className="h-10 bg-slate-100 rounded"></div>
      </div>
    </div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {isPending && <SubmittingLoader status="Updating navigation item" />}

      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Navigation Information</h3>
          <p className="text-xs text-slate-500 mt-1">Edit the display label for this navigation link. The route path cannot be changed.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Key</label>
            <input
              type="text"
              value={item.key}
              disabled
              className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400">Unique identifier (cannot be changed)</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Path</label>
            <input
              type="text"
              value={item.path}
              disabled
              className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400">Route path (cannot be changed)</p>
          </div>
        </div>

        <FormField
          label="Label *"
          name="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter the display label (e.g., Homepage)"
        />
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Settings</h3>
          <p className="text-xs text-slate-500 mt-1">Control display order and visibility.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Sort Order"
            name="sortOrder"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            placeholder="Display order"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Status</label>
            <select
              name="isActive"
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <PrimaryButton
          type="submit"
          text="Update Navigation"
          disabled={isPending}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
