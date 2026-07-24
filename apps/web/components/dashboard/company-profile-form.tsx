"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import FormField from "@/components/forms/form-field";
import { useForm } from "@/hooks/useForm";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import { revalidateCompanyProfile } from "@/actions/revalidate-action";
import { HslColorPicker } from "@/components/ui/hsl-color-picker";
import { Building2, Palette, Globe, MapPin, Phone, Mail, MessageCircle, Save, Search, Image as ImageIcon } from "lucide-react";
import type { CompanyProfile } from "@/types/company-profile";

interface CompanyProfileFormProps {
  profile: CompanyProfile | null;
}

export function CompanyProfileForm({ profile }: CompanyProfileFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const { values, handleChange, setField } = useForm({
    companyName: profile?.companyName || "",
    companyDescription: profile?.companyDescription || "",
    address: profile?.address || "",
    phoneNumber: profile?.phoneNumber || "",
    email: profile?.email || "",
    logoKey: profile?.logoKey || "",
    footerLogoKey: profile?.footerLogoKey || "",
    faviconKey: profile?.faviconKey || "",
    whatsappNumber: profile?.whatsappNumber || "",
    googleMap: profile?.googleMap || "",
    primaryColor: profile?.primaryColor || "221.2 83.2% 53.3%",
    secondaryColor: profile?.secondaryColor || "210 40% 96.1%",
    socialMedia: profile?.socialMedia || [],
    seoMeta: {
      metaTitle: profile?.seoMeta?.metaTitle || "",
      metaDescription: profile?.seoMeta?.metaDescription || "",
      metaKeywords: profile?.seoMeta?.metaKeywords?.join(", ") || "",
      canonicalUrl: profile?.seoMeta?.canonicalUrl || "",
      metaRobots: profile?.seoMeta?.metaRobots || "index, follow",
      ogTitle: profile?.seoMeta?.ogTitle || "",
      ogDescription: profile?.seoMeta?.ogDescription || "",
      ogImageKey: profile?.seoMeta?.ogImageKey || "",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const metaKeywordsArray = values.seoMeta.metaKeywords
      ? values.seoMeta.metaKeywords.split(",").map((k: string) => k.trim())
      : [];

    const payload = {
      ...values,
      seoMeta: {
        ...values.seoMeta,
        metaKeywords: metaKeywordsArray,
        ogTitle: values.seoMeta.ogTitle || values.seoMeta.metaTitle || values.companyName,
        ogDescription: values.seoMeta.ogDescription || values.seoMeta.metaDescription,
        ogImageKey: values.seoMeta.ogImageKey || values.logoKey,
      },
    };

    try {
      const res = await apiClient<any>(API_ROUTES.COMPANY_PROFILE, {
        method: "PUT",
        body: JSON.stringify(payload),
        isAuthenticated: true,
      });

      if (res.success) {
        await revalidateCompanyProfile();
        router.refresh();
      }
    } catch (error: any) {
      alert(error.message || "Failed to update company profile");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primarymain/10 rounded-xl">
                  <Building2 className="h-5 w-5 text-primarymain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Company Information</h3>
                  <p className="text-xs text-slate-500">Basic company details</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="Company Name"
                  name="companyName"
                  value={values.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="info@company.com"
                />
                <FormField
                  label="Phone Number"
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onChange={handleChange}
                  placeholder="+977-9800000000"
                />
                <FormField
                  label="WhatsApp Number"
                  name="whatsappNumber"
                  value={values.whatsappNumber}
                  onChange={handleChange}
                  placeholder="+977-9800000000"
                />
              </div>

              <FormField
                label="Address"
                name="address"
                value={values.address}
                onChange={handleChange}
                placeholder="Kathmandu, Nepal"
              />

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Company Description</label>
                <textarea
                  name="companyDescription"
                  value={values.companyDescription}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your company..."
                  className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primarymain/20 focus-visible:border-primarymain/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Google Map Embed</label>
                <textarea
                  name="googleMap"
                  value={values.googleMap}
                  onChange={handleChange}
                  rows={3}
                  placeholder="<iframe>...</iframe>"
                  className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primarymain/20 focus-visible:border-primarymain/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primarymain/10 rounded-xl">
                  <Search className="h-5 w-5 text-primarymain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">SEO Settings</h3>
                  <p className="text-xs text-slate-500">Optimize for search engines</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="Meta Title"
                  name="seoMeta.metaTitle"
                  value={values.seoMeta.metaTitle}
                  onChange={handleChange}
                  placeholder={values.companyName || "SEO title"}
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
                rows={3}
                value={values.seoMeta.metaDescription}
                onChange={handleChange}
                placeholder="SEO description"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="Canonical URL"
                  name="seoMeta.canonicalUrl"
                  value={values.seoMeta.canonicalUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
                <FormField
                  label="Meta Robots"
                  name="seoMeta.metaRobots"
                  value={values.seoMeta.metaRobots}
                  onChange={handleChange}
                  placeholder="index, follow"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Logos & Favicon */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primarymain/10 rounded-xl">
                  <ImageIcon className="h-5 w-5 text-primarymain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Logos</h3>
                  <p className="text-xs text-slate-500">Brand assets</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700">Main Logo</label>
                <FileUpload
                  defaultImage={values.logoKey}
                  onSuccess={(url) => setField("logoKey", url)}
                  returnType="url"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700">Footer Logo</label>
                <FileUpload
                  defaultImage={values.footerLogoKey}
                  onSuccess={(url) => setField("footerLogoKey", url)}
                  returnType="url"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700">Favicon</label>
                <FileUpload
                  defaultImage={values.faviconKey}
                  onSuccess={(url) => setField("faviconKey", url)}
                  returnType="url"
                />
              </div>
            </div>
          </div>

          {/* Brand Colors */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primarymain/10 rounded-xl">
                  <Palette className="h-5 w-5 text-primarymain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Brand Colors</h3>
                  <p className="text-xs text-slate-500">Set your colors</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <HslColorPicker
                label="Primary Color"
                value={values.primaryColor}
                onChange={(hsl) => setField("primaryColor", hsl)}
              />
              <HslColorPicker
                label="Secondary Color"
                value={values.secondaryColor}
                onChange={(hsl) => setField("secondaryColor", hsl)}
              />

              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
                <p className="text-xs font-bold text-slate-700 mb-3">Preview</p>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div
                      className="h-12 rounded-lg shadow-inner border border-white"
                      style={{ backgroundColor: `hsl(${values.primaryColor})` }}
                    />
                    <p className="text-[10px] text-slate-500 mt-1.5 text-center font-medium">Primary</p>
                  </div>
                  <div className="flex-1">
                    <div
                      className="h-12 rounded-lg shadow-inner border border-white"
                      style={{ backgroundColor: `hsl(${values.secondaryColor})` }}
                    />
                    <p className="text-[10px] text-slate-500 mt-1.5 text-center font-medium">Secondary</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-primarymain hover:bg-secondarymain text-white flex items-center gap-2 px-8 py-3 rounded-xl font-semibold shadow-lg shadow-primarymain/25 hover:shadow-xl hover:shadow-secondarymain/25 transition-all hover:-translate-y-0.5"
        >
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
