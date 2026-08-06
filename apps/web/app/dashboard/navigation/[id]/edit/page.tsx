import { getNavigationItemById } from "@/actions/navigation-action";
import { NavigationForm } from "@/components/dashboard/navigation-form";
import NoData from "@/components/no-data";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default async function EditNavigationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getNavigationItemById(id);

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h2 className="text-lg font-black tracking-tight text-primarymain">Edit Navigation Item</h2>
        <BreadCrumbs path="navigation" page="Edit" />
      </div>
      {item ? <NavigationForm item={item} /> : <NoData title="Navigation Item" />}
    </div>
  );
}
