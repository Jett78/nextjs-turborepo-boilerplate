import { ServiceForm } from "@/components/dashboard/service-form";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h2 className="text-lg font-black tracking-tight text-primarymain">Create New Service</h2>
        <BreadCrumbs path="services" page="Add" />
      </div>
      <ServiceForm />
    </div>
  );
}
