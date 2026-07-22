"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import { useCrud } from "@/hooks/useCRUD";
import { useForm } from "@/hooks/useForm";
import { API_ROUTES } from "@/config/api-routes";
import { revalidateTestimonials } from "@/actions/revalidate-action";
import type { TestimonialFormProps } from "@/types/components";

export function TestimonialForm({ testimonial }: TestimonialFormProps) {
  const router = useRouter();
  const isEditing = !!testimonial;

  const { create, put } = useCrud<Record<string, any>>({
    endpoint: API_ROUTES.TESTIMONIAL,
    queryKey: "testimonials",
    isAuthenticated: true,
  });

  const { values, handleChange, setField } = useForm({
    name: testimonial?.name || "",
    message: testimonial?.message || "",
    designation: testimonial?.designation || "",
    avatar: testimonial?.avatar || "",
    sortOrder: testimonial?.sortOrder?.toString() || "",
  });

  const isPending = isEditing ? put.isPending : create.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Record<string, any> = {
      name: values.name,
      message: values.message,
      designation: values.designation,
      avatar: values.avatar,
    };

    if (isEditing && values.sortOrder !== "") {
      payload.sortOrder = parseInt(values.sortOrder, 10);
    }

    if (isEditing) {
      put.mutate(
        { id: testimonial.id, data: payload },
        {
          onSuccess: async (res: any) => {
            if (res.success) {
              await revalidateTestimonials();
              router.push("/dashboard/testimonials");
            }
          },
          onError: (error: any) => {
            alert(error.message || "Failed to update testimonial");
          },
        }
      );
    } else {
      create.mutate(payload, {
        onSuccess: async (res: any) => {
          if (res.success) {
            await revalidateTestimonials();
            router.push("/dashboard/testimonials");
          }
        },
        onError: (error: any) => {
          alert(error.message || "Failed to create testimonial");
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Customer name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            name="designation"
            value={values.designation}
            onChange={handleChange}
            placeholder="CEO, Company Name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          value={values.message}
          onChange={handleChange}
          placeholder="Testimonial message"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Avatar</Label>
        <FileUpload
          defaultImage={values.avatar}
          onSuccess={(url) => setField("avatar", url)}
          returnType="url"
        />
      </div>

      {isEditing && (
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            value={values.sortOrder}
            onChange={handleChange}
            placeholder="Auto-calculated"
            min="0"
          />
          <p className="text-xs text-muted-foreground">
            Leave empty to keep current order. Changing this will swap with existing item.
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Saving..."
            : isEditing
              ? "Update Testimonial"
              : "Create Testimonial"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/testimonials")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
