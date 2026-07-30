"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PrimaryButton from "@/components/ui/primary-button";
import FileUpload from "@/components/ui/file-upload";
import FormField from "@/components/forms/form-field";
import { useForm } from "@/hooks/useForm";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import { revalidateCompanyProfile } from "@/actions/revalidate-action";
import { showSuccess, showError } from "@/lib/toast-helper";
import { HslColorPicker } from "@/components/ui/hsl-color-picker";
import { Building2, Palette, Image as ImageIcon } from "lucide-react";
import SubmittingLoader from "@/components/dashboard/submitting-loader";
import type { CompanyProfile } from "@/types/company-profile";

function toCssHsl(hsl: string): string {
  if (hsl.includes("/")) {
    const parts = hsl.split("/").map((s) => s.trim());
    const colorPart = parts[0];
    const alphaPart = parts[1];
    if (colorPart && alphaPart) {
      const alpha = parseFloat(alphaPart.replace("%", "")) / 100;
      return `hsla(${colorPart}, ${alpha})`;
    }
  }
  return `hsl(${hsl})`;
}

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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const res = await apiClient<any>(API_ROUTES.COMPANY_PROFILE, {
        method: "PUT",
        body: JSON.stringify(values),
        isAuthenticated: true,
      });

      if (res.success) {
        await revalidateCompanyProfile();
        router.refresh();
        showSuccess("Company profile updated successfully");
      }
    } catch (error: any) {
      showError(error.message || "Failed to update company profile");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isPending && <SubmittingLoader status="Saving company profile" />}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Main Content */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
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
                {values.googleMap && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-slate-200">
                    <iframe
                      src={
                        values.googleMap.includes("src=")
                          ? values.googleMap.match(/src="([^"]+)"/)?.[1]
                          : values.googleMap
                      }
                      loading="lazy"
                      className="w-full h-[300px] border-0"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
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
                      style={{ backgroundColor: toCssHsl(values.primaryColor) }}
                    />
                    <p className="text-[10px] text-slate-500 mt-1.5 text-center font-medium">Primary</p>
                  </div>
                  <div className="flex-1">
                    <div
                      className="h-12 rounded-lg shadow-inner border border-white"
                      style={{ backgroundColor: toCssHsl(values.secondaryColor) }}
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
        <PrimaryButton
          type="submit"
          text="Save Changes"
          disabled={isPending}
        />
      </div>
    </form>
  );
}
