"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import FormField from "@/components/forms/form-field";
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Testimonial Information</h3>
          <p className="text-xs text-slate-500 mt-1">Customer testimonial details.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Name *"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Customer name"
          />
          <FormField
            label="Designation"
            name="designation"
            value={values.designation}
            onChange={handleChange}
            placeholder="CEO, Company Name"
          />
        </div>

        <FormField
          label="Message *"
          name="message"
          textarea
          rows={4}
          value={values.message}
          onChange={handleChange}
          placeholder="Testimonial message"
        />
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Avatar</h3>
          <p className="text-xs text-slate-500 mt-1">Upload customer photo.</p>
        </div>

        <FileUpload
          defaultImage={values.avatar}
          onSuccess={(url) => setField("avatar", url)}
          returnType="url"
        />
      </div>

      {/* Sort Order (Edit only) */}
      {isEditing && (
        <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Sort Order</h3>
            <p className="text-xs text-slate-500 mt-1">Control display order.</p>
          </div>

          <FormField
            label="Sort Order"
            name="sortOrder"
            type="number"
            value={values.sortOrder}
            onChange={handleChange}
            placeholder="Auto-calculated"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90">
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
