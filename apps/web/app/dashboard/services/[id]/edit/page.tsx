import { ServiceForm } from "@/components/dashboard/service-form";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import type { Service } from "@/types/service";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await apiClient<{ data: Service }>(
    `${API_ROUTES.SERVICE}/${id}`,
    { next: { tags: [`service-${id}`] } }
  );

  const service = res.data;

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Service</h1>
        <BreadCrumbs path="services" page="Edit" />
      </div>
      <ServiceForm service={service} />
    </div>
  );
}
