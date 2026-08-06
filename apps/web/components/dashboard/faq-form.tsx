"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/components/ui/primary-button";
import FormField from "@/components/forms/form-field";
import { useCrud } from "@/hooks/useCRUD";
import { useForm } from "@/hooks/useForm";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { API_ROUTES } from "@/config/api-routes";
import { revalidateFaqs } from "@/actions/revalidate-action";
import SubmittingLoader from "@/components/dashboard/submitting-loader";
import type { FaqFormProps } from "@/types/components";

export function FaqForm({ faq }: FaqFormProps) {
  const isEditing = !!faq;

  const { create, put } = useCrud<Record<string, any>>({
    endpoint: API_ROUTES.FAQ,
    queryKey: "faqs",
    isAuthenticated: true,
  });

  const { values, handleChange } = useForm({
    question: faq?.question || "",
    answer: faq?.answer || "",
    sortOrder: faq?.sortOrder?.toString() || "",
    isActive: faq?.isActive?.toString() || "true",
  });

  const isPending = isEditing ? put.isPending : create.isPending;

  const { onSuccess, onError } = useFormSubmit({
    entityName: "FAQ",
    redirectPath: "/dashboard/faqs",
    entityId: faq?.id,
    revalidateAction: revalidateFaqs,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Record<string, any> = {
      question: values.question,
      answer: values.answer,
      isActive: values.isActive === "true",
    };

    if (isEditing && values.sortOrder !== "") {
      payload.sortOrder = parseInt(values.sortOrder, 10);
    }

    if (isEditing) {
      put.mutate({ id: faq.id, data: payload }, { onSuccess, onError });
    } else {
      create.mutate(payload, { onSuccess, onError });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {isPending && <SubmittingLoader status={isEditing ? "Updating FAQ" : "Creating FAQ"} />}

      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">FAQ Information</h3>
          <p className="text-xs text-slate-500 mt-1">Question and answer details.</p>
        </div>

        <FormField
          label="Question *"
          name="question"
          value={values.question}
          onChange={handleChange}
          placeholder="Enter the question"
        />

        <FormField
          label="Answer *"
          name="answer"
          textarea
          rows={4}
          value={values.answer}
          onChange={handleChange}
          placeholder="Enter the answer"
        />
      </div>

      {isEditing && (
        <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Settings</h3>
            <p className="text-xs text-slate-500 mt-1">Control display order and visibility.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Sort Order"
              name="sortOrder"
              type="number"
              value={values.sortOrder}
              onChange={handleChange}
              placeholder="Auto-calculated"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select
                name="isActive"
                value={values.isActive}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <PrimaryButton
          type="submit"
          text={isEditing ? "Update FAQ" : "Create FAQ"}
          disabled={isPending}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
