"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import { revalidateFaqs } from "@/actions/revalidate-action";
import type { DeleteFaqButtonProps } from "@/types/components";

export function DeleteFaqButton({ id }: DeleteFaqButtonProps) {
  const router = useRouter();

  const { remove } = useCrud({
    endpoint: API_ROUTES.FAQ,
    queryKey: "faqs",
    isAuthenticated: true,
  });

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    remove.mutate(id, {
      onSuccess: async (res: any) => {
        if (res.success) {
          await revalidateFaqs();
          router.refresh();
        }
      },
      onError: (error: any) => {
        alert(error.message || "Failed to delete FAQ");
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
