import { getPageSeoList } from "@/actions/page-seo-action";
import { PageSeoManager } from "@/components/dashboard/page-seo-manager";
import DashboardHeading from "@/components/dashboard/dashboard-heading";

export const metadata = {
  title: "Page SEO | Dashboard",
};

export default async function PageSeoPage() {
  const pages = await getPageSeoList();

  return (
    <div className="space-y-6">
      <DashboardHeading
        title="Page SEO"
        description="Manage meta tags for individual pages"
      />
      <PageSeoManager pages={pages} />
    </div>
  );
}
