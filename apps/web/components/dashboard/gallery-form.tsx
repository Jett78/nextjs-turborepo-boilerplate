"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/components/ui/primary-button";
import FormField from "@/components/forms/form-field";
import ImageUploadMultiple from "@/components/ui/image-upload-multiple";
import { useCrud } from "@/hooks/useCRUD";
import { useForm } from "@/hooks/useForm";
import { API_ROUTES } from "@/config/api-routes";
import { revalidateGallery } from "@/actions/revalidate-action";
import { showSuccess, showError } from "@/lib/toast-helper";
import SubmittingLoader from "@/components/dashboard/submitting-loader";
import { X, Plus } from "lucide-react";
import { GALLERY_CATEGORIES } from "@/types/gallery";
import type { GalleryFormProps } from "@/types/components";

export function GalleryForm({ item }: GalleryFormProps) {
  const router = useRouter();
  const isEditing = !!item;

  const { create, put } = useCrud<Record<string, any>>({
    endpoint: API_ROUTES.GALLERY,
    queryKey: "gallery",
    isAuthenticated: true,
  });

  const { values, handleChange, setField } = useForm({
    title: item?.title || "",
    description: item?.description || "",
    category: item?.category || "other",
    isActive: item?.isActive ?? true,
    sortOrder: item?.sortOrder?.toString() || "",
    slug: item?.slug || "",
  });

  const [images, setImages] = useState<Array<{ url: string; key: string }>>(
    item?.images?.map((url) => ({ url, key: url })) || []
  );
  const [tags, setTags] = useState<string[]>(item?.tags || []);
  const [newTag, setNewTag] = useState("");

  const isPending = isEditing ? put.isPending : create.isPending;

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      showError("Please upload at least one image");
      return;
    }

    const payload: Record<string, any> = {
      title: values.title,
      slug: values.slug || undefined,
      description: values.description || undefined,
      images: images.map((img) => img.url),
      category: values.category,
      tags: tags.length > 0 ? tags : undefined,
      isActive: values.isActive,
    };

    if (isEditing && values.sortOrder !== "") {
      payload.sortOrder = parseInt(values.sortOrder, 10);
    }

    if (isEditing) {
      put.mutate(
        { id: item.id, data: payload },
        {
          onSuccess: async (res: any) => {
            if (res.success) {
              await revalidateGallery();
              showSuccess("Gallery item updated successfully");
              router.push("/dashboard/gallery");
            }
          },
          onError: (error: any) => {
            showError(error.message || "Failed to update gallery item");
          },
        }
      );
    } else {
      create.mutate(payload, {
        onSuccess: async (res: any) => {
          if (res.success) {
            await revalidateGallery();
            showSuccess("Gallery item created successfully");
            router.push("/dashboard/gallery");
          }
        },
        onError: (error: any) => {
          showError(error.message || "Failed to create gallery item");
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {isPending && <SubmittingLoader status={isEditing ? "Updating gallery item" : "Creating gallery item"} />}

      {/* Basic Info */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Gallery Information</h3>
          <p className="text-xs text-slate-500 mt-1">Basic gallery item details.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Title *"
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder="Gallery item title"
          />
          <FormField
            label="Slug"
            name="slug"
            value={values.slug}
            onChange={handleChange}
            placeholder="auto-generated-from-title"
          />
        </div>

        <FormField
          label="Description"
          name="description"
          textarea
          rows={3}
          value={values.description}
          onChange={handleChange}
          placeholder="Brief description"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Category *</label>
            <select
              value={values.category}
              onChange={(e) => setField("category", e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              {GALLERY_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Active</label>
            <div className="flex items-center gap-3 h-10">
              <button
                type="button"
                onClick={() => setField("isActive", !values.isActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  values.isActive ? "bg-indigo-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    values.isActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-sm text-slate-500">
                {values.isActive ? "Visible" : "Hidden"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Images</h3>
          <p className="text-xs text-slate-500 mt-1">Upload images for this gallery item.</p>
        </div>

        <ImageUploadMultiple
          defaultImages={images}
          onSuccess={setImages}
          folder="gallery"
          maxImages={20}
        />
      </div>

      {/* Tags */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Tags</h3>
          <p className="text-xs text-slate-500 mt-1">Add tags for filtering.</p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a tag and press Enter"
            className="flex-1 h-10 rounded-md border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <Button type="button" variant="outline" onClick={addTag} className="shrink-0">
            <Plus className="size-4" />
          </Button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5"
              >
                <span className="text-xs font-medium text-slate-700">{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status & Order */}
      {isEditing && (
        <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Order</h3>
            <p className="text-xs text-slate-500 mt-1">Control display order.</p>
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
          text={isEditing ? "Update Gallery Item" : "Create Gallery Item"}
          disabled={isPending}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/gallery")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
