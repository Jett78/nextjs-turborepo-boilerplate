"use client";

import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import { NavigationForm } from "@/components/dashboard/navigation-form";
import SubmittingLoader from "@/components/dashboard/submitting-loader";
import type { NavigationItem } from "@/types/navigation";

interface NavigationEditClientProps {
  id: string;
}

export function NavigationEditClient({ id }: NavigationEditClientProps) {
  const { getOne } = useCrud<NavigationItem>({
    endpoint: API_ROUTES.NAVIGATION,
    queryKey: "navigation",
  });

  const { data, isLoading, isError, error } = getOne(id);

  if (isLoading) {
    return <SubmittingLoader status="Loading navigation item" />;
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-rose-600 font-bold">
        Error: {(error as Error).message}
      </div>
    );
  }

  const item = data as NavigationItem;

  if (!item) {
    return (
      <div className="p-8 text-center text-slate-500">
        Navigation item not found.
      </div>
    );
  }

  return <NavigationForm item={item} />;
}
