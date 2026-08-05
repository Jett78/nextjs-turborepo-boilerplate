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
        <h1 className="text-2xl font-bold tracking-tight">Edit Navigation Item</h1>
        <BreadCrumbs path="navigation" page="Edit" />
      </div>
      <NavigationEditClient id={id} />
    </div>
  );
}
