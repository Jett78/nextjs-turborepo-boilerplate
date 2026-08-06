import { FaqForm } from "@/components/dashboard/faq-form";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import type { Faq } from "@/types/faq";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await apiClient<{ data: Faq }>(
    `${API_ROUTES.FAQ}/${id}`,
    { next: { tags: [`faq-${id}`] } }
  );

  const faq = res.data;

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h2 className="text-lg font-black tracking-tight text-primarymain">Edit FAQ</h2>
        <BreadCrumbs path="faqs" page="Edit" />
      </div>
      <FaqForm faq={faq} />
    </div>
  );
}
