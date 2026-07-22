import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TestimonialForm } from "@/components/dashboard/testimonial-form";

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Testimonial</h1>
          <p className="text-muted-foreground">Add a new testimonial</p>
        </div>
        <Link href="/dashboard/testimonials">
          <Button variant="outline">Back to Testimonials</Button>
        </Link>
      </div>
      <TestimonialForm />
    </div>
  );
}
