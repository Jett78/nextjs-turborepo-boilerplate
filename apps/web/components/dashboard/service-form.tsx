"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/components/ui/primary-button";
import FormField from "@/components/forms/form-field";
import FileUpload from "@/components/ui/file-upload";
import ImageUploadMultiple from "@/components/ui/image-upload-multiple";
import { useCrud } from "@/hooks/useCRUD";
import { useForm } from "@/hooks/useForm";
import { API_ROUTES } from "@/config/api-routes";
import { revalidateServices } from "@/actions/revalidate-action";
import { showSuccess, showError } from "@/lib/toast-helper";
import SubmittingLoader from "@/components/dashboard/submitting-loader";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, Plus, GripVertical } from "lucide-react";
import type { ServiceFormProps } from "@/types/components";

function SortableFeature({
  feature,
  index,
  onChange,
  onRemove,
}: {
  feature: string;
  index: number;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `feature-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1"
    >
      <button
        type="button"
        className="cursor-grab text-slate-400 hover:text-slate-600 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <input
        type="text"
        value={feature}
        onChange={(e) => onChange(index, e.target.value)}
        className="flex-1 min-w-0 border-0 bg-transparent px-1 py-0.5 text-sm text-slate-700 focus:outline-none focus:ring-0 placeholder:text-slate-400"
        placeholder="Feature"
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-slate-400 hover:text-red-500 transition-colors p-1"
      >
        <X className="size-3" />
      </button>
    </div>
  );
}

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const isEditing = !!service;

  const { create, put } = useCrud<Record<string, any>>({
    endpoint: API_ROUTES.SERVICE,
    queryKey: "services",
    isAuthenticated: true,
  });

  const { values, handleChange, setField } = useForm({
    name: service?.name || "",
    shortDescription: service?.shortDescription || "",
    description: service?.description || "",
    price: service?.price?.toString() || "",
    offerPrice: service?.offerPrice?.toString() || "",
    isActive: service?.isActive ?? true,
    sortOrder: service?.sortOrder?.toString() || "",
    slug: service?.slug || "",
  });

  const [features, setFeatures] = useState<string[]>(service?.features || []);
  const [newFeature, setNewFeature] = useState("");
  const [imageKey, setImageKey] = useState<string>(service?.imageKey || "");
  const [gallery, setGallery] = useState<Array<{ url: string; key: string }>>(
    service?.gallery?.map((url) => ({ url, key: url })) || []
  );

  const isPending = isEditing ? put.isPending : create.isPending;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, value: string) => {
    setFeatures(features.map((f, i) => (i === index ? value : f)));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = features.findIndex((_, i) => `feature-${i}` === active.id);
      const newIndex = features.findIndex((_, i) => `feature-${i}` === over.id);
      setFeatures(arrayMove(features, oldIndex, newIndex));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Record<string, any> = {
      name: values.name,
      slug: values.slug || undefined,
      shortDescription: values.shortDescription,
      description: values.description,
      imageKey: imageKey || undefined,
      gallery: gallery.length > 0 ? gallery.map((img) => img.url) : undefined,
      price: values.price !== "" ? parseInt(values.price, 10) : undefined,
      offerPrice: values.offerPrice !== "" ? parseInt(values.offerPrice, 10) : undefined,
      features: features.length > 0 ? features : undefined,
      isActive: values.isActive,
    };

    if (isEditing && values.sortOrder !== "") {
      payload.sortOrder = parseInt(values.sortOrder, 10);
    }

    if (isEditing) {
      put.mutate(
        { id: service.id, data: payload },
        {
          onSuccess: async (res: any) => {
            if (res.success) {
              await revalidateServices();
              showSuccess("Service updated successfully");
              router.push("/dashboard/services");
            }
          },
          onError: (error: any) => {
            showError(error.message || "Failed to update service");
          },
        }
      );
    } else {
      create.mutate(payload, {
        onSuccess: async (res: any) => {
          if (res.success) {
            await revalidateServices();
            showSuccess("Service created successfully");
            router.push("/dashboard/services");
          }
        },
        onError: (error: any) => {
          showError(error.message || "Failed to create service");
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {isPending && <SubmittingLoader status={isEditing ? "Updating service" : "Creating service"} />}

      {/* Basic Info */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Service Information</h3>
          <p className="text-xs text-slate-500 mt-1">Basic service details.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Name *"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Service name"
          />
          <FormField
            label="Slug"
            name="slug"
            value={values.slug}
            onChange={handleChange}
            placeholder="auto-generated-from-name"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Short Description"
            name="shortDescription"
            value={values.shortDescription}
            onChange={handleChange}
            placeholder="Brief one-liner"
          />
        </div>

        <FormField
          label="Description"
          name="description"
          textarea
          rows={5}
          value={values.description}
          onChange={handleChange}
          placeholder="Detailed service description"
        />

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Image</label>
          <FileUpload
            defaultImage={imageKey}
            onSuccess={(url) => setImageKey(url)}
          />
        </div>

        {/* Gallery Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Gallery Images</label>
          <p className="text-xs text-slate-500">Upload additional images for this service.</p>
          <ImageUploadMultiple
            defaultImages={gallery}
            onSuccess={setGallery}
            folder="services/gallery"
            maxImages={10}
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Pricing</h3>
          <p className="text-xs text-slate-500 mt-1">Set service pricing.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Price"
            name="price"
            type="number"
            value={values.price}
            onChange={handleChange}
            placeholder="0"
          />
          <FormField
            label="Offer Price"
            name="offerPrice"
            type="number"
            value={values.offerPrice}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
      </div>

      {/* Features with Drag and Drop */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Features</h3>
          <p className="text-xs text-slate-500 mt-1">Add and reorder feature highlights for this service.</p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a feature and press Enter"
            className="flex-1 h-10 rounded-md border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <Button type="button" variant="outline" onClick={addFeature} className="shrink-0">
            <Plus className="size-4" />
          </Button>
        </div>

        {features.length > 0 && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={features.map((_, i) => `feature-${i}`)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-2">
                {features.map((feature, index) => (
                  <SortableFeature
                    key={`feature-${index}`}
                    feature={feature}
                    index={index}
                    onChange={updateFeature}
                    onRemove={removeFeature}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {features.length > 0 && (
          <p className="text-xs text-slate-400">Drag the grip icon to reorder features</p>
        )}
      </div>

      {/* Status & Order */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Status & Order</h3>
          <p className="text-xs text-slate-500 mt-1">Control visibility and display order.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Active</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setField("isActive", !values.isActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  values.isActive ? "bg-primarymain" : "bg-slate-200"
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

          {isEditing && (
            <FormField
              label="Sort Order"
              name="sortOrder"
              type="number"
              value={values.sortOrder}
              onChange={handleChange}
              placeholder="Auto-calculated"
            />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <PrimaryButton
          type="submit"
          text={isEditing ? "Update Service" : "Create Service"}
          disabled={isPending}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/services")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
