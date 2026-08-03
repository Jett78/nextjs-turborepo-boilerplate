"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/components/ui/primary-button";
import FileUpload from "@/components/ui/file-upload";
import FormField from "@/components/forms/form-field";
import { useCrud } from "@/hooks/useCRUD";
import { useForm } from "@/hooks/useForm";
import { API_ROUTES } from "@/config/api-routes";
import { revalidateTeamMembers } from "@/actions/revalidate-action";
import { showSuccess, showError } from "@/lib/toast-helper";
import SubmittingLoader from "@/components/dashboard/submitting-loader";
import type { TeamMemberFormProps } from "@/types/components";

export function TeamMemberForm({ teamMember }: TeamMemberFormProps) {
  const router = useRouter();
  const isEditing = !!teamMember;

  const { create, put } = useCrud<Record<string, any>>({
    endpoint: API_ROUTES.TEAM,
    queryKey: "team-members",
    isAuthenticated: true,
  });

  const { values, handleChange, setField } = useForm({
    name: teamMember?.name || "",
    designation: teamMember?.designation || "",
    joinedDate: teamMember?.joinedDate
      ? new Date(teamMember.joinedDate).toISOString().split("T")[0]
      : "",
    message: teamMember?.message || "",
    avatar: teamMember?.avatar || "",
    whatsappUrl: teamMember?.whatsappUrl || "",
    sortOrder: teamMember?.sortOrder?.toString() || "",
  });

  const isPending = isEditing ? put.isPending : create.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Record<string, any> = {
      name: values.name,
      designation: values.designation,
      joinedDate: values.joinedDate || undefined,
      message: values.message,
      avatar: values.avatar,
      whatsappUrl: values.whatsappUrl || undefined,
    };

    if (isEditing && values.sortOrder !== "") {
      payload.sortOrder = parseInt(values.sortOrder, 10);
    }

    if (isEditing) {
      put.mutate(
        { id: teamMember.id, data: payload },
        {
          onSuccess: async (res: any) => {
            if (res.success) {
              await revalidateTeamMembers();
              showSuccess("Team member updated successfully");
              router.push("/dashboard/team");
            }
          },
          onError: (error: any) => {
            showError(error.message || "Failed to update team member");
          },
        }
      );
    } else {
      create.mutate(payload, {
        onSuccess: async (res: any) => {
          if (res.success) {
            await revalidateTeamMembers();
            showSuccess("Team member created successfully");
            router.push("/dashboard/team");
          }
        },
        onError: (error: any) => {
          showError(error.message || "Failed to create team member");
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {isPending && <SubmittingLoader status={isEditing ? "Updating team member" : "Creating team member"} />}
      {/* Basic Info */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Team Member Information</h3>
          <p className="text-xs text-slate-500 mt-1">Personal and professional details.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Name *"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Full name"
          />
          <FormField
            label="Designation"
            name="designation"
            value={values.designation}
            onChange={handleChange}
            placeholder="e.g. Senior Developer"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Joined Date"
            name="joinedDate"
            type="date"
            value={values.joinedDate}
            onChange={handleChange}
          />
          <FormField
            label="WhatsApp URL (Optional)"
            name="whatsappUrl"
            value={values.whatsappUrl}
            onChange={handleChange}
            placeholder="https://wa.me/1234567890"
          />
        </div>

        <FormField
          label="Message"
          name="message"
          textarea
          rows={4}
          value={values.message}
          onChange={handleChange}
          placeholder="Short bio or message about the team member"
        />
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Avatar</h3>
          <p className="text-xs text-slate-500 mt-1">Upload team member photo.</p>
        </div>

        <FileUpload
          defaultImage={values.avatar}
          onSuccess={(url) => setField("avatar", url)}
          returnType="url"
        />
      </div>

      {/* Sort Order (Edit only) */}
      {isEditing && (
        <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Sort Order</h3>
            <p className="text-xs text-slate-500 mt-1">Control display order. Changing this will swap positions.</p>
          </div>

          <FormField
            label="Sort Order"
            name="sortOrder"
            type="number"
            value={values.sortOrder}
            onChange={handleChange}
            placeholder="Auto-calculated"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <PrimaryButton
          type="submit"
          text={isEditing ? "Update Team Member" : "Create Team Member"}
          disabled={isPending}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/team")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
