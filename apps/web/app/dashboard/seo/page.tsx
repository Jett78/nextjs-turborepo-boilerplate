import { getSeoSettings } from "@/actions/seo-action";
import { SeoSettingsForm } from "@/components/dashboard/seo-settings-form";
import DashboardHeading from "@/components/dashboard/dashboard-heading";

export const metadata = {
  title: "SEO & Analytics | Dashboard",
};

export default async function SeoPage() {
  const seo = await getSeoSettings();

  return (
    <div className="space-y-6">
      <DashboardHeading
        title="SEO & Analytics"
        description="Manage meta tags, Google Analytics, GTM, and Search Console"
      />
      <SeoSettingsForm seo={seo} />
    </div>
  );
}
