import { getRedirectById } from "@/actions/redirect-action";
import { RedirectForm } from "@/components/dashboard/redirect-form";
import NoData from "@/components/no-data";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default async function EditRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const redirect = await getRedirectById(id);

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h2 className="text-lg font-black tracking-tight text-primarymain">Edit Redirect</h2>
        <BreadCrumbs path="redirects" page="Edit" />
      </div>
      {redirect ? <RedirectForm redirect={redirect} /> : <NoData title="Redirect" />}
    </div>
  );
}
