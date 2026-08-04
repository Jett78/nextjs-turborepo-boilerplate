"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/components/ui/primary-button";
import FormField from "@/components/forms/form-field";
import { useCrud } from "@/hooks/useCRUD";
import { useForm } from "@/hooks/useForm";
import { API_ROUTES } from "@/config/api-routes";
import { revalidateRedirects } from "@/actions/redirect-action";
import { showSuccess, showError } from "@/lib/toast-helper";
import SubmittingLoader from "@/components/dashboard/submitting-loader";
import type { Redirect } from "@/types/redirect";

interface RedirectFormProps {
  redirect?: Redirect;
}

export function RedirectForm({ redirect }: RedirectFormProps) {
  const router = useRouter();
  const isEditing = !!redirect;

  const { create, put } = useCrud<Record<string, any>>({
    endpoint: API_ROUTES.REDIRECT,
    queryKey: "redirects",
    isAuthenticated: true,
  });

  const { values, handleChange } = useForm({
    fromPath: redirect?.fromPath || "",
    toPath: redirect?.toPath || "",
  });

  const isPending = isEditing ? put.isPending : create.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!values.fromPath || !values.toPath) return;

    const payload = {
      fromPath: values.fromPath,
      toPath: values.toPath,
    };

    if (isEditing) {
      put.mutate(
        { id: redirect.id, data: payload },
        {
          onSuccess: async (res: any) => {
            if (res.success) {
              await revalidateRedirects();
              showSuccess("Redirect updated successfully");
              router.push("/dashboard/redirects");
            }
          },
          onError: (error: any) => {
            showError(error.message || "Failed to update redirect");
          },
        }
      );
    } else {
      create.mutate(payload, {
        onSuccess: async (res: any) => {
          if (res.success) {
            await revalidateRedirects();
            showSuccess("Redirect created successfully");
            router.push("/dashboard/redirects");
          }
        },
        onError: (error: any) => {
          showError(error.message || "Failed to create redirect");
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {isPending && (
        <SubmittingLoader
          status={isEditing ? "Updating redirect" : "Creating redirect"}
        />
      )}

      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Redirect Paths</h3>
          <p className="text-xs text-slate-500 mt-1">
            Define the source and destination paths for this redirect.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="From Path *"
            name="fromPath"
            value={values.fromPath}
            onChange={handleChange}
            placeholder="/old-page"
          />
          <FormField
            label="To Path *"
            name="toPath"
            value={values.toPath}
            onChange={handleChange}
            placeholder="/new-page"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <PrimaryButton
          type="submit"
          text={isEditing ? "Update Redirect" : "Create Redirect"}
          disabled={isPending}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/redirects")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
