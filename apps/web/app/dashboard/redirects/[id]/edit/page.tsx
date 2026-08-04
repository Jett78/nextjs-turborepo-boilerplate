import { RedirectForm } from "@/components/dashboard/redirect-form";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import type { Redirect } from "@/types/redirect";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default async function EditRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await apiClient<{ data: Redirect }>(
    `${API_ROUTES.REDIRECT}/${id}`,
    { next: { tags: [`redirect-${id}`] } }
  );

  const redirect = res.data;

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Redirect</h1>
        <BreadCrumbs path="redirects" page="Edit" />
      </div>
      <RedirectForm redirect={redirect} />
    </div>
  );
}
