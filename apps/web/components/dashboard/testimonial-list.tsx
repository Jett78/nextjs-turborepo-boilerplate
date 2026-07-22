"use client";

import Link from "next/link";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteTestimonialButton } from "./delete-testimonial-button";
import type { Testimonial } from "@/types/testimonial";

export function TestimonialList() {
  const { getAll } = useCrud<Testimonial>({
    endpoint: API_ROUTES.TESTIMONIAL,
    queryKey: "testimonials",
  });

  const { data, isLoading, isError } = getAll({ take: 50 });

  if (isLoading) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        Loading testimonials...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border p-8 text-center text-destructive">
        Failed to load testimonials. Please try again.
      </div>
    );
  }

  const testimonials = data || [];

  if (testimonials.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        No testimonials found. Create your first testimonial!
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map((testimonial: any) => (
            <TableRow key={testimonial.id}>
              <TableCell className="font-medium">{testimonial.sortOrder}</TableCell>
              <TableCell>{testimonial.name}</TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">
                {testimonial.message}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {testimonial.designation || "-"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/dashboard/testimonials/${testimonial.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <DeleteTestimonialButton id={testimonial.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
