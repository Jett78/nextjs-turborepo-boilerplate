import { getServiceById } from "@/actions/service-action";
import { ServiceForm } from "@/components/dashboard/service-form";
import NoData from "@/components/no-data";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getServiceById(id);

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h2 className="text-lg font-black tracking-tight text-primarymain">Edit Service</h2>
        <BreadCrumbs path="services" page="Edit" />
      </div>
      {service ? <ServiceForm service={service} /> : <NoData title="Service" />}
    </div>
  );
}
