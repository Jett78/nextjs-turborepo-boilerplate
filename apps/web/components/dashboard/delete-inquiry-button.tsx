"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";

export function DeleteInquiryButton({ id }: { id: string }) {
  const router = useRouter();

  const { remove } = useCrud({
    endpoint: API_ROUTES.INQUIRY,
    queryKey: "inquiries",
    isAuthenticated: true,
  });

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    remove.mutate(id, {
      onSuccess: async (res: any) => {
        if (res.success) {
          router.refresh();
        }
      },
      onError: (error: any) => {
        alert(error.message || "Failed to delete inquiry");
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
