import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TestimonialList } from "@/components/dashboard/testimonial-list";

export default function TestimonialsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground">Manage your testimonials</p>
        </div>
        <Link href="/dashboard/testimonials/new">
          <Button>Create Testimonial</Button>
        </Link>
      </div>
      <TestimonialList />
    </div>
  );
}
