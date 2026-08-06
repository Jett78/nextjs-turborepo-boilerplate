import { getTestimonialById } from "@/actions/testimonial-action";
import { TestimonialForm } from "@/components/dashboard/testimonial-form";
import NoData from "@/components/no-data";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await getTestimonialById(id);

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h2 className="text-lg font-black tracking-tight text-primarymain">Edit Testimonial</h2>
        <BreadCrumbs path="testimonials" page="Edit" />
      </div>
      {testimonial ? <TestimonialForm testimonial={testimonial} /> : <NoData title="Testimonial" />}
    </div>
  );
}
