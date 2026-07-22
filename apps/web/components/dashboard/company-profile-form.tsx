"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import { useForm } from "@/hooks/useForm";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import { revalidateCompanyProfile } from "@/actions/revalidate-action";
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Company Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              name="companyName"
              value={values.companyName}
              onChange={handleChange}
              placeholder="Company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="info@company.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={values.phoneNumber}
              onChange={handleChange}
              placeholder="+977-9800000000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              value={values.whatsappNumber}
              onChange={handleChange}
              placeholder="+977-9800000000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={values.address}
            onChange={handleChange}
            placeholder="Kathmandu, Nepal"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyDescription">Company Description</Label>
          <Textarea
            id="companyDescription"
            name="companyDescription"
            value={values.companyDescription}
            onChange={handleChange}
            placeholder="About your company"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="googleMap">Google Map Embed</Label>
          <Textarea
            id="googleMap"
            name="googleMap"
            value={values.googleMap}
            onChange={handleChange}
            placeholder="<iframe>...</iframe>"
            rows={3}
          />
        </div>
      </div>

      <div className="border-t pt-6 space-y-6">
        <h3 className="text-lg font-medium">Logos & Favicon</h3>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Logo</Label>
            <FileUpload
              defaultImage={values.logoKey}
              onSuccess={(url) => setField("logoKey", url)}
              returnType="url"
            />
          </div>

          <div className="space-y-2">
            <Label>Footer Logo</Label>
            <FileUpload
              defaultImage={values.footerLogoKey}
              onSuccess={(url) => setField("footerLogoKey", url)}
              returnType="url"
            />
          </div>

          <div className="space-y-2">
            <Label>Favicon</Label>
            <FileUpload
              defaultImage={values.faviconKey}
              onSuccess={(url) => setField("faviconKey", url)}
              returnType="url"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6 space-y-6">
        <h3 className="text-lg font-medium">SEO Settings</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoMeta.metaTitle">Meta Title</Label>
            <Input
              id="seoMeta.metaTitle"
              name="seoMeta.metaTitle"
              value={values.seoMeta.metaTitle}
              onChange={handleChange}
              placeholder={values.companyName || "SEO title"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoMeta.metaDescription">Meta Description</Label>
            <Textarea
              id="seoMeta.metaDescription"
              name="seoMeta.metaDescription"
              value={values.seoMeta.metaDescription}
              onChange={handleChange}
              placeholder="SEO description"
              rows={2}
            />
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

          <div className="space-y-2">
            <Label htmlFor="seoMeta.canonicalUrl">Canonical URL</Label>
            <Input
              id="seoMeta.canonicalUrl"
              name="seoMeta.canonicalUrl"
              value={values.seoMeta.canonicalUrl}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
