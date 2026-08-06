import { RedirectForm } from "@/components/dashboard/redirect-form";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default function NewRedirectPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h2 className="text-lg font-black tracking-tight text-primarymain">Create New Redirect</h2>
        <BreadCrumbs path="redirects" page="Add" />
      </div>
      <RedirectForm />
    </div>
  );
}
