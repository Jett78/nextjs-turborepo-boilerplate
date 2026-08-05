"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCrud } from "@/hooks/useCRUD";
import { Trash2 } from "lucide-react";
import { showError } from "@/lib/toast-helper";

interface DeleteButtonProps {
  id: string;
  endpoint: string;
  queryKey: string;
  confirmMessage?: string;
  entityName?: string;
  onSuccess?: () => Promise<void> | void;
}

export function DeleteButton({
  id,
  endpoint,
  queryKey,
  confirmMessage,
  entityName = "item",
  onSuccess,
}: DeleteButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { remove } = useCrud({
    endpoint,
    queryKey,
    isAuthenticated: true,
  });

  const handleDelete = async () => {
    remove.mutate(id, {
      onSuccess: async (res: unknown) => {
        if (res && typeof res === 'object' && 'success' in res && res.success) {
          if (onSuccess) {
            await onSuccess();
          }
          setOpen(false);
          router.refresh();
        }
      },
      onError: (error: Error) => {
        showError(error.message || `Failed to delete ${entityName}`);
        setOpen(false);
      },
    });
  };

  const message = confirmMessage || `Are you sure you want to delete this ${entityName}? This action cannot be undone.`;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<span className="inline-flex" />}>
        <Button
          variant="destructive"
          size="sm"
          className="hover:bg-red-500 hover:text-white"

        >
          <Trash2 className="size-3 mr-1" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={remove.isPending}
            className="bg-red-500 hover:bg-red-600"
          >
            {remove.isPending ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
