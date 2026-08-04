"use client";

import React, { useEffect, useRef, useState } from "react";
import { uploadMultipleImages } from "@/actions/upload-action";
import { showSuccess, showError } from "@/lib/toast-helper";
import { X, Upload, Loader2 } from "lucide-react";

interface ImageUploadMultipleProps {
  onSuccess?: (images: Array<{ url: string; key: string }>) => void;
  defaultImages?: Array<{ url: string; key: string }>;
  folder?: string;
  maxImages?: number;
  className?: string;
}

export default function ImageUploadMultiple({
  onSuccess,
  defaultImages = [],
  folder = "uploads",
  maxImages = 10,
  className,
}: ImageUploadMultipleProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<Array<{ url: string; key: string }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultImages.length) {
      setImages(defaultImages);
    }
  }, [defaultImages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    if (images.length + fileArray.length > maxImages) {
      showError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const formData = new FormData();
    fileArray.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("folder", folder);

    setIsUploading(true);
    const res = await uploadMultipleImages(formData);
    setIsUploading(false);

    if (!res.success) {
      showError(res.error || "Image upload failed");
      return;
    }

    if (res.data) {
      const updatedImages = [...images, ...res.data];
      setImages(updatedImages);
      onSuccess?.(updatedImages);
      showSuccess(`${res.data.length} image(s) uploaded`);
    }

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onSuccess?.(updatedImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length === 0) {
      showError("Please drop image files only");
      return;
    }

    if (images.length + files.length > maxImages) {
      showError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("folder", folder);

    setIsUploading(true);
    const res = await uploadMultipleImages(formData);
    setIsUploading(false);

    if (!res.success) {
      showError(res.error || "Image upload failed");
      return;
    }

    if (res.data) {
      const updatedImages = [...images, ...res.data];
      setImages(updatedImages);
      onSuccess?.(updatedImages);
      showSuccess(`${res.data.length} image(s) uploaded`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition-all hover:border-indigo-400 hover:bg-indigo-50/50 ${
          isUploading ? "pointer-events-none opacity-60" : "cursor-pointer"
        } ${className}`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="text-sm font-medium text-slate-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
              <Upload className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Click to upload or drag and drop
              </p>
              <p className="mt-1 text-xs text-slate-500">
                PNG, JPG, WEBP up to 10MB each (max {maxImages} images)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <img
                src={image.url}
                alt={`Upload ${index + 1}`}
                className="h-full w-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />

              {/* Remove Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Index Badge */}
              <div className="absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-xs font-medium text-white backdrop-blur-sm">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
