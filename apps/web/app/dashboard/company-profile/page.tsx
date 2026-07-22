import { CompanyProfileForm } from "@/components/dashboard/company-profile-form";
import { getCompanyProfile } from "@/actions/company-profile-action";


export const metadata = {
  title: "Company Profile | Dashboard",
};

export default async function CompanyProfilePage() {
  const profile = await getCompanyProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Company Profile</h1>
        <p className="text-muted-foreground">
          Manage your company information and SEO settings
        </p>
      </div>
      <CompanyProfileForm profile={profile} />
    </div>
  );
}
