import { getPageSeoByPath } from "@/actions/page-seo-action";
import { PageSeoForm } from "@/components/dashboard/page-seo-form";
import NoData from "@/components/no-data";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default async function EditPageSeoPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  const pageSeo = await getPageSeoByPath(path);

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h2 className="text-lg font-black tracking-tight text-primarymain">Edit Page SEO</h2>
        <BreadCrumbs path="page-seo" page="Edit" />
      </div>
      {pageSeo ? <PageSeoForm pageSeo={pageSeo} /> : <NoData title="Page SEO" />}
    </div>
  );
}
