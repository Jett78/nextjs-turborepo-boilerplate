import { TestimonialForm } from "@/components/dashboard/testimonial-form";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h2 className="text-lg font-black tracking-tight text-primarymain">Create New Testimonial</h2>
        <BreadCrumbs path="testimonials" page="Add" />
      </div>
      <TestimonialForm />
    </div>
  );
}
