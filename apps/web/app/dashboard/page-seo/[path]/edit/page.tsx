import { PageSeoForm } from "@/components/dashboard/page-seo-form";
import BreadCrumbs from "@/components/ui/bread-crumbs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getPageSeo(path: string) {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const res = await fetch(`${API_BASE_URL}/page-seo/${cleanPath}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export default async function EditPageSeoPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  const pageSeo = await getPageSeo(path);

  if (!pageSeo) {
    return (
      <div className="space-y-6">
        <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
          <h1 className="text-2xl font-bold tracking-tight">Page SEO Not Found</h1>
          <BreadCrumbs path="page-seo" page="Edit" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Page SEO</h1>
        <BreadCrumbs path="page-seo" page="Edit" />
      </div>
      <PageSeoForm pageSeo={pageSeo} />
    </div>
  );
}
