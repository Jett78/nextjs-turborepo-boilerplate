"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiClient, TOKEN_TYPES } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import { revalidateBlogs } from "@/actions/revalidate-action";
import type { Blog } from "@/types/blog";
import type { ApiError } from "@/types/base-entity";

interface BlogFormProps {
  blog?: Blog;
}

interface BlogFormData {
  title: string;
  slug: string;
  description: string;
  imageKey: string;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!blog;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogFormData>({
    defaultValues: {
      title: blog?.title || "",
      slug: blog?.slug || "",
      description: blog?.description || "",
      imageKey: blog?.imageKey || "",
      isActive: blog?.isActive ?? true,
      metaTitle: blog?.seoMeta?.metaTitle || "",
      metaDescription: blog?.seoMeta?.metaDescription || "",
      metaKeywords: blog?.seoMeta?.metaKeywords?.join(", ") || "",
    },
  });

  const title = watch("title");
  const description = watch("description");
  const imageKey = watch("imageKey");

  const mutation = useMutation({
    mutationFn: (data: BlogFormData) => {
      const payload = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        imageKey: data.imageKey,
        isActive: data.isActive,
        seoMeta: {
          metaTitle: data.metaTitle || data.title,
          metaDescription: data.metaDescription || data.description,
          metaKeywords: data.metaKeywords
            ? data.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
            : [],
          ogTitle: data.metaTitle || data.title,
          ogDescription: data.metaDescription || data.description,
          ogImageKey: data.imageKey,
        },
      };

      if (isEditing) {
        return apiClient(`${API_ROUTES.BLOG}/${blog.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
          isAuthenticated: true,
          tokenType: TOKEN_TYPES.USER,
        });
      }

      return apiClient(API_ROUTES.BLOG, {
        method: "POST",
        body: JSON.stringify(payload),
        isAuthenticated: true,
        tokenType: TOKEN_TYPES.USER,
      });
    },
    onSuccess: async () => {
      await revalidateBlogs();
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      router.push("/dashboard/blogs");
      router.refresh();
    },
    onError: (error: ApiError) => {
      alert(error.message || "Failed to save blog");
    },
  });

  const onSubmit = (data: BlogFormData) => {
    mutation.mutate(data);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("title", value);
    setValue("slug", slugify(value));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register("title", { required: "Title is required" })}
            onChange={handleTitleChange}
            placeholder="Blog post title"
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            {...register("slug", { required: "Slug is required" })}
            placeholder="blog-post-slug"
          />
          {errors.slug && (
            <p className="text-sm text-destructive">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Brief description of the blog post"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageKey">Image Key</Label>
        <Input
          id="imageKey"
          {...register("imageKey")}
          placeholder="blogs/image.jpg"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          {...register("isActive")}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">SEO Settings</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              {...register("metaTitle")}
              placeholder={title || "SEO title (defaults to blog title)"}
            />
            <p className="text-xs text-muted-foreground">
              Defaults to blog title if empty
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              {...register("metaDescription")}
              placeholder={description || "SEO description (defaults to blog description)"}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Defaults to blog description if empty
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaKeywords">Meta Keywords</Label>
            <Input
              id="metaKeywords"
              {...register("metaKeywords")}
              placeholder="keyword1, keyword2, keyword3"
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated keywords
            </p>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Open Graph (Auto-filled)</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>OG Title</Label>
            <Input
              value={title}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label>OG Description</Label>
            <Textarea
              value={description}
              disabled
              className="bg-muted"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>OG Image</Label>
            <Input
              value={imageKey}
              disabled
              className="bg-muted"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Saving..."
            : isEditing
              ? "Update Blog"
              : "Create Blog"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/blogs")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
