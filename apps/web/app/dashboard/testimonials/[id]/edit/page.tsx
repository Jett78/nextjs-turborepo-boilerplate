import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TestimonialForm } from "@/components/dashboard/testimonial-form";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import type { Testimonial } from "@/types/testimonial";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Testimonial</h1>
          <p className="text-muted-foreground">Update testimonial details</p>
        </div>
        <Link href="/dashboard/testimonials">
          <Button variant="outline">Back to Testimonials</Button>
        </Link>
      </div>
      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}
