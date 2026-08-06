import { PageSeoForm } from "@/components/dashboard/page-seo-form";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default function NewPageSeoPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h2 className="text-lg font-black tracking-tight text-primarymain">Create Page SEO</h2>
        <BreadCrumbs path="page-seo" page="Add" />
      </div>
      <PageSeoForm />
    </div>
  );
}
