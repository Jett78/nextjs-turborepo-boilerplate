"use client";

import React, { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { uploadSingleImage } from "@/actions/upload-action";
import { showError, showSuccess } from "@/lib/toast-helper";
import Image from "next/image";

interface AvatarUploadProps {
  currentImage?: string | null;
  initials?: string;
  onImageUploaded: (imageUrl: string) => void;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
};

export default function AvatarUpload({
  currentImage,
  initials,
  onImageUploaded,
  size = "md",
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadSingleImage(formData);

      if (result.success && result.data?.urls?.original) {
        setPreview(result.data.urls.original);
        onImageUploaded(result.data.urls.original);
        showSuccess("Image uploaded successfully");
      } else {
        showError(result.error || "Failed to upload image");
        setPreview(null);
      }
    } catch {
      showError("Failed to upload image");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }

    e.target.value = "";
  };

  const displayImage = preview || currentImage;

  return (
    <div className="relative group">
      <div
        className={`${sizeClasses[size]} rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden`}
      >
        {isUploading ? (
          <Loader2 className={`${size === "lg" ? "size-10" : "size-6"} text-primarymain animate-spin`} />
        ) : displayImage ? (
          <Image
            src={displayImage}
            alt="Profile"
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className={`${textSizeClasses[size]} font-bold text-primarymain`}>
            {initials}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={handleImageClick}
        disabled={isUploading}
        className="absolute bottom-1 right-1 p-2 bg-primarymain rounded-xl text-white hover:bg-primarymain/90 transition-all shadow-md opacity-0 group-hover:opacity-100 disabled:opacity-50"
        title="Change Profile Picture"
      >
        <Camera className="size-4" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
}
