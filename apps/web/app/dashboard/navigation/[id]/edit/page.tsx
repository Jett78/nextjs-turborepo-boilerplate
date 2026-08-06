import { NavigationEditClient } from "@/components/dashboard/navigation-edit-client";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default async function EditNavigationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h2 className="text-lg font-black tracking-tight text-primarymain">Edit Navigation Item</h2>
        <BreadCrumbs path="navigation" page="Edit" />
      </div>
      <NavigationEditClient id={id} />
    </div>
  );
}
