"use client";

import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/ui/primary-button";
import FileUpload from "@/components/ui/file-upload";
import FormField from "@/components/forms/form-field";
import { useForm } from "@/hooks/useForm";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import { revalidateCompanyProfile } from "@/actions/revalidate-action";
import { showSuccess, showError } from "@/lib/toast-helper";
import { HslColorPicker } from "@/components/ui/hsl-color-picker";
import { Building2, Palette, Image as ImageIcon, Share2, RotateCcw } from "lucide-react";
import SubmittingLoader from "@/components/dashboard/submitting-loader";
import type { CompanyProfile } from "@/types/company-profile";

const DEFAULT_COLORS = {
  primaryColor: "221.2 83.2% 53.3%",
  secondaryColor: "210 40% 96.1%",
  textForeground: "222.2 84% 4.9%",
};

function toCssHsl(hsl: string): string {
  if (hsl.includes("/")) {
    const parts = hsl.split("/").map((s) => s.trim());
    const colorPart = parts[0];
    const alphaPart = parts[1];
    if (colorPart && alphaPart) {
      const alpha = parseFloat(alphaPart.replace("%", "")) / 100;
      const [h, s, l] = colorPart.split(" ").map((v) => v.replace("%", "").trim());
      return `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
    }
  }
  const [h, s, l] = hsl.split(" ").map((v) => v.replace("%", "").trim());
  return `hsl(${h}, ${s}%, ${l}%)`;
}

interface CompanyProfileFormProps {
  profile: CompanyProfile | null;
}

export function CompanyProfileForm({ profile }: CompanyProfileFormProps) {
  const router = useRouter();
  const isEditing = !!profile;

  const { create, put } = useCrud<Record<string, any>>({
    endpoint: API_ROUTES.COMPANY_PROFILE,
    queryKey: "company-profile",
    isAuthenticated: true,
  });

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
    textForeground: profile?.textForeground || "222.2 84% 4.9%",
    facebookUrl: profile?.facebookUrl || "",
    instagramUrl: profile?.instagramUrl || "",
    tiktokUrl: profile?.tiktokUrl || "",
    twitterUrl: profile?.twitterUrl || "",
  });

  const isPending = isEditing ? put.isPending : create.isPending;

  const handleResetColors = () => {
    setField("primaryColor", DEFAULT_COLORS.primaryColor);
    setField("secondaryColor", DEFAULT_COLORS.secondaryColor);
    setField("textForeground", DEFAULT_COLORS.textForeground);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      put.mutate(
        { id: profile!.id, data: values },
        {
          onSuccess: async (res: any) => {
            if (res.success) {
              await revalidateCompanyProfile();
              router.refresh();
              showSuccess("Company profile updated successfully");
            }
          },
          onError: (error: any) => {
            showError(error.message || "Failed to update company profile");
          },
        }
      );
    } else {
      create.mutate(values, {
        onSuccess: async (res: any) => {
          if (res.success) {
            await revalidateCompanyProfile();
            showSuccess("Company profile created successfully");
          }
        },
        onError: (error: any) => {
          showError(error.message || "Failed to create company profile");
        },
      });
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
        
          {/* Social Media */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primarymain/10 rounded-xl">
                  <Share2 className="h-5 w-5 text-primarymain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Social Media</h3>
                  <p className="text-xs text-slate-500">Add your social links</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1877F2]/10 flex-shrink-0">
                    <svg className="h-4 w-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <FormField
                    label="Facebook"
                    name="facebookUrl"
                    value={values.facebookUrl}
                    onChange={handleChange}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#F58529]/10 via-[#DD2A7B]/10 to-[#8134AF]/10 flex-shrink-0">
                    <svg className="h-4 w-4 text-[#DD2A7B]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </div>
                  <FormField
                    label="Instagram"
                    name="instagramUrl"
                    value={values.instagramUrl}
                    onChange={handleChange}
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#000000]/10 flex-shrink-0">
                    <svg className="h-4 w-4 text-[#000000]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  </div>
                  <FormField
                    label="TikTok"
                    name="tiktokUrl"
                    value={values.tiktokUrl}
                    onChange={handleChange}
                    placeholder="https://tiktok.com/@yourpage"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#000000]/10 flex-shrink-0">
                    <svg className="h-4 w-4 text-[#000000]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <FormField
                    label="Twitter / X"
                    name="twitterUrl"
                    value={values.twitterUrl}
                    onChange={handleChange}
                    placeholder="https://x.com/yourpage"
                  />
                </div>
              </div>
            </div>
          </div>
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
              <HslColorPicker
                label="Text Foreground"
                value={values.textForeground}
                onChange={(hsl) => setField("textForeground", hsl)}
              />

              <button
                type="button"
                onClick={handleResetColors}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-black hover:bg-slate-800 rounded-lg transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset to default colors
              </button>

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
                  <div className="flex-1">
                    <div
                      className="h-12 rounded-lg shadow-inner border border-white"
                      style={{ backgroundColor: toCssHsl(values.textForeground) }}
                    />
                    <p className="text-[10px] text-slate-500 mt-1.5 text-center font-medium">Text</p>
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
          text={isEditing ? "Save Changes" : "Create Profile"}
          disabled={isPending}
        />
      </div>
    </form>
  );
}