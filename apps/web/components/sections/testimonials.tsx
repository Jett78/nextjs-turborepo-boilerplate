import { getTestimonials } from "@/actions/testimonial-action";
import TestimonialSlider from "./testimonial-slider";
import TestimonialCard from "../cards/testimonial-card";
import PageHeader from "../ui/page-header";

export async function Testimonials() {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) {
    return null;
  }

  const showSlider = testimonials.length >= 3;

  return (
    <section className="relative overflow-hidden bg-muted/30 py-24 sm:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.03] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
       <PageHeader
          title="What our clients say"
          subtitle="Testimonials"
          desc="Hear from our satisfied clients and discover how our services have made a positive impact "
        />


        <div className="mx-auto mt-16 max-w-6xl">
          {showSlider ? (
            <TestimonialSlider testimonials={testimonials} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
