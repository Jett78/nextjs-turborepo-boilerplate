import { getFaqs } from "@/actions/faq-action";
import FaqAccordion from "./faq-accordion";
import PageHeader from "../ui/page-header";

export async function FaqSection() {
  const faqs = await getFaqs();

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-muted/30 py-24 sm:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.03] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Frequently Asked Questions"
          subtitle="FAQ"
          desc="Find answers to common questions about our services and products."
        />

        <div className="mx-auto mt-16 max-w-3xl">
          <FaqAccordion faqs={faqs} />
        </div>
      </div>
    </section>
  );
}
