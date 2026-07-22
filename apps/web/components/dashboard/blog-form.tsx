"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import { useCrud } from "@/hooks/useCRUD";
import { useForm } from "@/hooks/useForm";
import { API_ROUTES } from "@/config/api-routes";
import { revalidateBlogs, revalidateBlog } from "@/actions/revalidate-action";
import type { BlogFormProps } from "@/types/components";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter();
  const isEditing = !!blog;

  const { create, put } = useCrud<Record<string, any>>({
    endpoint: API_ROUTES.BLOG,
    queryKey: "blogs",
    isAuthenticated: true,
  });

  const { values, errors, handleChange, setField } = useForm({
    title: blog?.title || "",
    description: blog?.description || "",
    imageKey: blog?.imageKey || "",
    seoMeta: {
      metaTitle: blog?.seoMeta?.metaTitle || "",
      metaDescription: blog?.seoMeta?.metaDescription || "",
      metaKeywords: blog?.seoMeta?.metaKeywords?.join(", ") || "",
      ogTitle: blog?.seoMeta?.ogTitle || "",
      ogDescription: blog?.seoMeta?.ogDescription || "",
      ogImageKey: blog?.seoMeta?.ogImageKey || "",
      metaRobots: blog?.seoMeta?.metaRobots || "index, follow",
      canonicalUrl: blog?.seoMeta?.canonicalUrl || "",
    },
  });

  const isPending = isEditing ? put.isPending : create.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const slug = generateSlug(values.title);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const metaKeywordsArray = values.seoMeta.metaKeywords
      ? values.seoMeta.metaKeywords.split(",").map((keyword: string) => keyword.trim())
      : [];

    const payload = {
      title: values.title,
      slug,
      description: values.description,
      imageKey: values.imageKey,
      seoMeta: {
        metaTitle: values.seoMeta.metaTitle || values.title,
        metaDescription: values.seoMeta.metaDescription || values.description,
        metaKeywords: metaKeywordsArray,
        ogTitle: values.seoMeta.ogTitle || values.seoMeta.metaTitle || values.title,
        ogDescription: values.seoMeta.ogDescription || values.seoMeta.metaDescription || values.description,
        ogImageKey: values.seoMeta.ogImageKey || values.imageKey,
        metaRobots: "index, follow",
        canonicalUrl: `${baseUrl}/blog/${slug}`,
      },
    };

    if (isEditing) {
      put.mutate(
        { id: blog.id, data: payload },
        {
          onSuccess: async (res: any) => {
            if (res.success) {
              await revalidateBlogs();
              await revalidateBlog(slug);
              router.push("/dashboard/blogs");
            }
          },
          onError: (error: any) => {
            alert(error.message || "Failed to update blog");
          },
        }
      );
    } else {
      create.mutate(payload, {
        onSuccess: async (res: any) => {
          if (res.success) {
            await revalidateBlogs();
            await revalidateBlog(slug);
            router.push("/dashboard/blogs");
          }
        },
        onError: (error: any) => {
          alert(error.message || "Failed to create blog");
        },
      });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setField("title", value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={values.title}
            onChange={handleTitleChange}
            placeholder="Blog post title"
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            value={generateSlug(values.title)}
            disabled
            className="bg-muted"
            placeholder="blog-post-slug"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Brief description of the blog post"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Blog Image</Label>
        <FileUpload
          defaultImage={values.imageKey}
          onSuccess={(url) => setField("imageKey", url)}
          returnType="url"
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">SEO Settings</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoMeta.metaTitle">Meta Title</Label>
            <Input
              id="seoMeta.metaTitle"
              name="seoMeta.metaTitle"
              value={values.seoMeta.metaTitle}
              onChange={handleChange}
              placeholder={values.title || "SEO title (defaults to blog title)"}
            />
            <p className="text-xs text-muted-foreground">
              Defaults to blog title if empty
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoMeta.metaDescription">Meta Description</Label>
            <Textarea
              id="seoMeta.metaDescription"
              name="seoMeta.metaDescription"
              value={values.seoMeta.metaDescription}
              onChange={handleChange}
              placeholder={values.description || "SEO description (defaults to blog description)"}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Defaults to blog description if empty
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoMeta.metaKeywords">Meta Keywords</Label>
            <Input
              id="seoMeta.metaKeywords"
              name="seoMeta.metaKeywords"
              value={values.seoMeta.metaKeywords}
              onChange={handleChange}
              placeholder="keyword1, keyword2, keyword3"
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated keywords
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending
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
