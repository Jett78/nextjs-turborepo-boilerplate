"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import { revalidateBlogs } from "@/actions/revalidate-action";
import type { DeleteBlogButtonProps } from "@/types/components";

export function DeleteBlogButton({ id }: DeleteBlogButtonProps) {
  const router = useRouter();

  const { remove } = useCrud({
    endpoint: API_ROUTES.BLOG,
    queryKey: "blogs",
    isAuthenticated: true,
  });

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    remove.mutate(id, {
      onSuccess: async (res: any) => {
        if (res.success) {
          await revalidateBlogs();
          router.refresh();
        }
      },
      onError: (error: any) => {
        alert(error.message || "Failed to delete blog");
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
