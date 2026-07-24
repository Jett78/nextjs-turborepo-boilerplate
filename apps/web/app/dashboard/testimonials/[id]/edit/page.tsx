import { TestimonialForm } from "@/components/dashboard/testimonial-form";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import type { Testimonial } from "@/types/testimonial";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await apiClient<{ data: Testimonial }>(
    `${API_ROUTES.TESTIMONIAL}/${id}`,
    { next: { tags: [`testimonial-${id}`] } }
  );

  const testimonial = res.data;

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Testimonial</h1>
        <BreadCrumbs path="testimonials" page="Edit" />
      </div>
      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}
