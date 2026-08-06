import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/toast-helper";

interface UseFormSubmitOptions {
  entityName: string;
  redirectPath: string;
  entityId?: string;
  revalidateAction?: () => Promise<void>;
}

export function useFormSubmit({
  entityName,
  redirectPath,
  entityId,
  revalidateAction,
}: UseFormSubmitOptions) {
  const router = useRouter();
  const isEditing = !!entityId;

  const onSuccess = async (res: any) => {
    if (res.success) {
      if (revalidateAction) await revalidateAction();
      showSuccess(`${entityName} ${isEditing ? "updated" : "created"} successfully`);
      router.push(redirectPath);
    }
  };

  const onError = (error: any) => {
    showError(error.message || `Failed to ${isEditing ? "update" : "create"} ${entityName.toLowerCase()}`);
  };

  return { onSuccess, onError };
}
