import { CompanyProfileForm } from "@/components/dashboard/company-profile-form";
import { getCompanyProfile } from "@/actions/company-profile-action";
import DashboardHeading from "@/components/dashboard/dashboard-heading";

export const metadata = {
  title: "Company Profile | Dashboard",
};

export default async function CompanyProfilePage() {
  const profile = await getCompanyProfile();

  return (
    <div className="space-y-6">
      <DashboardHeading
        title="Company Profile"
        description="Manage your company information, branding, and SEO settings"
      />
      <CompanyProfileForm profile={profile} />
    </div>
  );
}
