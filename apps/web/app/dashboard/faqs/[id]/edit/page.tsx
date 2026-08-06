import { getFaqById } from "@/actions/faq-action";
import { FaqForm } from "@/components/dashboard/faq-form";
import NoData from "@/components/no-data";
import BreadCrumbs from "@/components/ui/bread-crumbs";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const faq = await getFaqById(id);

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-wrap justify-between gap-x-8 gap-y-6">
        <h2 className="text-lg font-black tracking-tight text-primarymain">Edit FAQ</h2>
        <BreadCrumbs path="faqs" page="Edit" />
      </div>
      {faq ? <FaqForm faq={faq} /> : <NoData title="FAQ" />}
    </div>
  );
}
