"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { uploadSingleImage } from "@/actions/upload-action";
import type { FileUploadProps } from "@/types/components";

const FIXED_FOLDER = "blogs";

export default function FileUpload({
  onSuccess,
  defaultImage,
  className,
  returnType = "url",
  accept = "image/*",
}: FileUploadProps) {
  const [isUploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultImage) {
      setPreviewUrl(defaultImage);
    }
  }, [defaultImage]);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", FIXED_FOLDER);

    setUploading(true);

    const res = await uploadSingleImage(formData);

    setUploading(false);

    if (res.success && res.data) {
      const originalUrl = res.data.urls.original;
      const originalKey = res.data.keys.original;

      setPreviewUrl(originalUrl);

      const valueToSend = returnType === "key" ? originalKey : originalUrl;
      onSuccess?.(valueToSend);
    } else {
      setPreviewUrl(null);
    }

    e.target.value = "";
  };

  return (
    <div className="relative h-60 w-full">
      <div
        onClick={openFilePicker}
        className="relative flex h-full w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Uploaded preview"
            className={`${className} h-full w-full rounded-md object-contain`}
          />
        ) : (
          <div className="flex flex-col items-center text-sm text-zinc-600">
            <svg
              className="mb-3 h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 16v-8m0 0 2 2m-2-2-2 2M4 16a4 4 0 004 4h8a4 4 0 000-8h-.26A6 6 0 104 16z"
              />
            </svg>
            <p className="font-medium">Click to upload</p>
            <p className="text-xs text-zinc-400">PNG, JPG, WEBP</p>
          </div>
        )}

        {previewUrl && !isUploading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openFilePicker();
            }}
            className="absolute right-3 bottom-3 rounded-md bg-black/60 px-3 py-1 text-xs text-white hover:bg-black/80"
          >
            Change image
          </button>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <svg
              className="h-6 w-6 animate-spin text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
        )}
      </div>

      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
