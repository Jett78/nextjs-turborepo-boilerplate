import { ServiceForm } from "@/components/dashboard/service-form";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Create New Service</h1>
        <BreadCrumbs path="services" page="Add" />
      </div>
      <ServiceForm />
    </div>
  );
}
