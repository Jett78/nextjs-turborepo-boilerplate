import { getPageSeoForMetadata } from "@/actions/page-seo-action";
import type { Metadata } from "next";
import { getServices } from "@/actions/service-action";
import { Sparkles } from "lucide-react";
import { ServiceCard } from "@/components/sections/service-card";
import NoData from "@/components/no-data";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeoForMetadata("/services");

  return {
    title: seo?.metaTitle ?? "Services",
    description: seo?.metaDescription ?? "",
    openGraph: {
      title: seo?.ogTitle ?? seo?.metaTitle ?? "Services",
      description: seo?.ogDescription ?? seo?.metaDescription ?? "",
      images: seo?.ogImageKey ? [{ url: seo.ogImageKey }] : [],
    },
  };
}

export default async function ServicesPage() {
  const services = await getServices();
  const activeServices = services.filter((s) => s.isActive);

  return (
    <section className="relative overflow-hidden">
      {/* Hero */}
      <div className="relative bg-slate-900 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-600/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 ring-1 ring-inset ring-white/10">
              <Sparkles className="h-3.5 w-3.5" />
              Services
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Services built for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                growth
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Professional solutions crafted to elevate your digital presence
              and drive measurable business results.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="relative bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {activeServices.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {activeServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          ) : (
            <NoData title="services" />
          )}
        </div>
      </div>
    </section>
  );
}
