"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import FormField from "@/components/forms/form-field";
import { useCrud } from "@/hooks/useCRUD";
import { useForm } from "@/hooks/useForm";
import { API_ROUTES } from "@/config/api-routes";
import { revalidateBlogs, revalidateBlog } from "@/actions/revalidate-action";
import { TiptapEditor } from "@/components/ui/tiptap-editor";
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Blog Information</h3>
          <p className="text-xs text-slate-500 mt-1">Basic blog post details.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Title *"
            name="title"
            value={values.title}
            onChange={(e) => setField("title", e.target.value)}
            placeholder="Blog post title"
            errors={errors.title}
          />
          <FormField
            label="Slug"
            value={generateSlug(values.title)}
            disabled
            placeholder="blog-post-slug"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Description</label>
          <TiptapEditor
            content={values.description}
            onChange={(content) => setField("description", content)}
            placeholder="Brief description of the blog post"
          />
        </div>
      </div>

      {/* Image */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Blog Image</h3>
          <p className="text-xs text-slate-500 mt-1">Upload a featured image.</p>
        </div>

        <FileUpload
          defaultImage={values.imageKey}
          onSuccess={(url) => setField("imageKey", url)}
          returnType="url"
        />
      </div>

      {/* SEO */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">SEO Settings</h3>
          <p className="text-xs text-slate-500 mt-1">Optimize for search engines.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Meta Title"
            name="seoMeta.metaTitle"
            value={values.seoMeta.metaTitle}
            onChange={handleChange}
            placeholder={values.title || "SEO title"}
          />
          <FormField
            label="Meta Keywords"
            name="seoMeta.metaKeywords"
            value={values.seoMeta.metaKeywords}
            onChange={handleChange}
            placeholder="keyword1, keyword2, keyword3"
          />
        </div>

        <FormField
          label="Meta Description"
          name="seoMeta.metaDescription"
          textarea
          rows={2}
          value={values.seoMeta.metaDescription}
          onChange={handleChange}
          placeholder={values.description || "SEO description"}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90">
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
