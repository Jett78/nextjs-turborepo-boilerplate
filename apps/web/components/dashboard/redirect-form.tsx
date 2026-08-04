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

const STATUS_CODE_INFO: Record<number, { label: string; description: string; useCase: string }> = {
  301: {
    label: "Moved Permanently",
    description: "The page has permanently moved to a new URL. Search engines will transfer all link equity (SEO value) to the new URL and update their index.",
    useCase: "Best for permanent URL changes — page moved, rebranded, or domain changed.",
  },
  302: {
    label: "Found (Temporary)",
    description: "The page is temporarily available at a different URL. Search engines keep the original URL indexed and will continue to crawl it.",
    useCase: "Use for temporary redirects — A/B testing, maintenance pages, or short-term promotions.",
  },
  307: {
    label: "Temporary Redirect",
    description: "Same as 302, but guarantees the HTTP method (GET, POST, etc.) will not change. Browsers won't change POST to GET.",
    useCase: "Use when you need a temporary redirect and must preserve the request method.",
  },
  308: {
    label: "Permanent Redirect",
    description: "Same as 301, but guarantees the HTTP method will not change. Search engines transfer link equity to the new URL.",
    useCase: "Use for permanent redirects where you must preserve the HTTP method (e.g., POST stays POST).",
  },
  410: {
    label: "Gone",
    description: "The page has been permanently deleted and will never be available again. Search engines will remove it from their index.",
    useCase: "Use for permanently removed pages — discontinued products, deleted content, or pages that should never return.",
  },
};

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
    statusCode: redirect?.statusCode || 301,
  });

  const isPending = isEditing ? put.isPending : create.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!values.fromPath || !values.toPath) return;

    const payload = {
      fromPath: values.fromPath,
      toPath: values.toPath,
      statusCode: Number(values.statusCode),
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

      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Redirect Paths</h3>
              <p className="text-xs text-slate-500 mt-1">
                Define the source and destination paths for this redirect.
              </p>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Status Code
              </label>
              <select
                name="statusCode"
                value={values.statusCode}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value={301}>301 - Moved Permanently</option>
                <option value={302}>302 - Found (Temporary)</option>
                <option value={307}>307 - Temporary Redirect</option>
                <option value={308}>308 - Permanent Redirect</option>
                <option value={410}>410 - Gone</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 self-start">
            <p className="text-sm font-bold text-slate-900">Status Code Reference</p>
            {Object.entries(STATUS_CODE_INFO).map(([code, info]) => (
              <div key={code} className="rounded-md bg-slate-50 border border-slate-100 p-3 space-y-1">
                <p className="text-xs font-semibold text-slate-900">
                  {code} {info.label}
                </p>
                <p className="text-xs text-slate-600">{info.description}</p>
                <p className="text-xs text-slate-500 italic">{info.useCase}</p>
              </div>
            ))}
          </div>
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
