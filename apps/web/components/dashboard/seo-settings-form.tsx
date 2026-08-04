"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PrimaryButton from "@/components/ui/primary-button";
import FileUpload from "@/components/ui/file-upload";
import FormField from "@/components/forms/form-field";
import { useForm } from "@/hooks/useForm";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import { showSuccess, showError } from "@/lib/toast-helper";
import { Search, Tag, BarChart3, Image as ImageIcon } from "lucide-react";
import SubmittingLoader from "@/components/dashboard/submitting-loader";
import type { GlobalSeo } from "@/types/seo";

interface SeoSettingsFormProps {
  seo: GlobalSeo | null;
}

export function SeoSettingsForm({ seo }: SeoSettingsFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const { values, handleChange, setField } = useForm({
    metaTitle: seo?.metaTitle || "",
    metaDescription: seo?.metaDescription || "",
    ogImageKey: seo?.ogImageKey || "",
    gtmContainerId: seo?.gtmContainerId || "",
    googleSearchConsoleVerification: seo?.googleSearchConsoleVerification || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const payload = {
      ...values,
    };

    try {
      const res = await apiClient<any>(API_ROUTES.SEO, {
        method: "PUT",
        body: JSON.stringify(payload),
        isAuthenticated: true,
      });

      if (res.success) {
        router.refresh();
        showSuccess("SEO settings updated successfully");
      }
    } catch (error: any) {
      showError(error.message || "Failed to update SEO settings");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isPending && <SubmittingLoader status="Saving SEO settings" />}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Meta Tags */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primarymain/10 rounded-xl">
                  <Search className="h-5 w-5 text-primarymain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Meta Tags</h3>
                  <p className="text-xs text-slate-500">Control how your site appears in search results</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <FormField
                label="Meta Title"
                name="metaTitle"
                value={values.metaTitle}
                onChange={handleChange}
                placeholder="My Awesome Page Title"
              />

              <FormField
                label="Meta Description"
                name="metaDescription"
                textarea
                rows={3}
                value={values.metaDescription}
                onChange={handleChange}
                placeholder="This is a description of my awesome page."
              />
            </div>
          </div>

          {/* OG Image */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primarymain/10 rounded-xl">
                  <ImageIcon className="h-5 w-5 text-primarymain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">OG Image</h3>
                  <p className="text-xs text-slate-500">Image shown when your site is shared on social media</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <FileUpload
                defaultImage={values.ogImageKey}
                onSuccess={(url) => setField("ogImageKey", url)}
                returnType="url"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Integrations */}
        <div className="space-y-6">
          {/* GTM */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primarymain/10 rounded-xl">
                  <BarChart3 className="h-5 w-5 text-primarymain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Google Tag Manager</h3>
                  <p className="text-xs text-slate-500">Track events and analytics</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <FormField
                label="GTM Container ID"
                name="gtmContainerId"
                value={values.gtmContainerId}
                onChange={handleChange}
                placeholder="GTM-XXXXXXX"
              />
            </div>
          </div>

          {/* Search Console */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primarymain/10 rounded-xl">
                  <Tag className="h-5 w-5 text-primarymain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Search Console</h3>
                  <p className="text-xs text-slate-500">Verify your site with Google</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <FormField
                label="Verification Code"
                name="googleSearchConsoleVerification"
                value={values.googleSearchConsoleVerification}
                onChange={handleChange}
                placeholder="aBcDeFgHiJkLmNoPqRsTuVwXyZ"
              />
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Get your verification code from{" "}
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primarymain hover:underline font-medium"
                  >
                    Google Search Console
                  </a>
                  . Add the HTML tag or meta tag content here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <PrimaryButton
          type="submit"
          text="Save Changes"
          disabled={isPending}
        />
      </div>
    </form>
  );
}
