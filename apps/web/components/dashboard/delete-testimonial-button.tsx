"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import { revalidateTestimonials } from "@/actions/revalidate-action";
import type { DeleteTestimonialButtonProps } from "@/types/components";

export function DeleteTestimonialButton({ id }: DeleteTestimonialButtonProps) {
  const router = useRouter();

  const { remove } = useCrud({
    endpoint: API_ROUTES.TESTIMONIAL,
    queryKey: "testimonials",
    isAuthenticated: true,
  });

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    remove.mutate(id, {
      onSuccess: async (res: any) => {
        if (res.success) {
          await revalidateTestimonials();
          router.refresh();
        }
      },
      onError: (error: any) => {
        alert(error.message || "Failed to delete testimonial");
      },
    });
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={remove.isPending}
    >
      {remove.isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
