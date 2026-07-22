"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiClient, TOKEN_TYPES } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import { revalidateBlogs } from "@/actions/revalidate-action";
import type { ApiError } from "@/types/base-entity";

interface DeleteBlogButtonProps {
  id: string;
}

export function DeleteBlogButton({ id }: DeleteBlogButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () =>
      apiClient(`${API_ROUTES.BLOG}/${id}`, {
        method: "DELETE",
        isAuthenticated: true,
        tokenType: TOKEN_TYPES.USER,
      }),
    onSuccess: async () => {
      await revalidateBlogs();
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      router.refresh();
    },
    onError: (error: ApiError) => {
      alert(error.message || "Failed to delete blog");
    },
  });

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => {
        if (confirm("Are you sure you want to delete this blog?")) {
          deleteMutation.mutate();
        }
      }}
      disabled={deleteMutation.isPending}
    >
      {deleteMutation.isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
