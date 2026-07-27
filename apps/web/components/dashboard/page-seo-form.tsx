"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import FormField from "@/components/forms/form-field";
import { useCrud } from "@/hooks/useCRUD";
import { useForm } from "@/hooks/useForm";
import { API_ROUTES } from "@/config/api-routes";
import type { PageSeoFormProps } from "@/types/components";
import { ArrowLeft, FileText, Globe, Image as ImageIcon } from "lucide-react";

export function PageSeoForm({ pageSeo }: PageSeoFormProps) {
  const router = useRouter();
  const isEditing = !!pageSeo;

  const { create, put } = useCrud<Record<string, any>>({
    endpoint: API_ROUTES.PAGE_SEO,
    queryKey: "page-seo",
    isAuthenticated: true,
  });

  const { values, handleChange, setField } = useForm({
    pagePath: pageSeo?.pagePath || "",
    pageTitle: pageSeo?.pageTitle || "",
    metaTitle: pageSeo?.metaTitle || "",
    metaDescription: pageSeo?.metaDescription || "",
    ogTitle: pageSeo?.ogTitle || "",
    ogDescription: pageSeo?.ogDescription || "",
    ogImageKey: pageSeo?.ogImageKey || "",
  });

  const isPending = isEditing ? put.isPending : create.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const path = values.pagePath.startsWith("/")
      ? values.pagePath.slice(1)
      : values.pagePath;

    const payload = {
      pagePath: path,
      pageTitle: values.pageTitle,
      metaTitle: values.metaTitle,
      metaDescription: values.metaDescription,
      ogTitle: values.ogTitle || values.metaTitle,
      ogDescription: values.ogDescription || values.metaDescription,
      ogImageKey: values.ogImageKey,
    };

    if (isEditing) {
      put.mutate(
        { id: pageSeo.pagePath, data: payload },
        {
          onSuccess: () => {
            router.push("/dashboard/page-seo");
          },
        }
      );
    } else {
      create.mutate(payload as any, {
        onSuccess: () => {
          router.push("/dashboard/page-seo");
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primarymain/10 rounded-xl">
              <FileText className="h-5 w-5 text-primarymain" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Page Path</h3>
              <p className="text-xs text-slate-500">The URL path for this page</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <FormField
            label="Page Path"
            name="pagePath"
            value={values.pagePath}
            onChange={handleChange}
            placeholder="about"
            required
          />
          <p className="text-xs text-slate-400 mt-2">The URL path of the page (e.g., about, services)</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primarymain/10 rounded-xl">
                  <FileText className="h-5 w-5 text-primarymain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Page Meta</h3>
                  <p className="text-xs text-slate-500">SEO settings for this page</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <FormField
                label="Page Title"
                name="pageTitle"
                value={values.pageTitle}
                onChange={handleChange}
                placeholder="About Us"
              />

              <FormField
                label="Meta Title"
                name="metaTitle"
                value={values.metaTitle}
                onChange={handleChange}
                placeholder="About Us - My Company"
              />

              <FormField
                label="Meta Description"
                name="metaDescription"
                value={values.metaDescription}
                onChange={handleChange}
                placeholder="Learn more about our company and our team."
                type="textarea"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primarymain/10 rounded-xl">
                  <Globe className="h-5 w-5 text-primarymain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Open Graph</h3>
                  <p className="text-xs text-slate-500">Social media preview settings</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <FormField
                label="OG Title"
                name="ogTitle"
                value={values.ogTitle}
                onChange={handleChange}
                placeholder="About Us"
              />

              <FormField
                label="OG Description"
                name="ogDescription"
                value={values.ogDescription}
                onChange={handleChange}
                placeholder="Learn more about our company."
                type="textarea"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">OG Image</label>
                <FileUpload
                  returnType="url"
                  defaultImage={values.ogImageKey}
                  onSuccess={(url) => setField("ogImageKey", url)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-primarymain hover:bg-secondarymain text-white flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primarymain/25 hover:shadow-xl transition-all"
        >
          {isPending ? "Saving..." : isEditing ? "Update Page SEO" : "Create Page SEO"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/page-seo")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
