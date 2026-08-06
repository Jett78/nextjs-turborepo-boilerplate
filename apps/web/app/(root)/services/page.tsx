import { getPageSeoForMetadata } from "@/actions/page-seo-action";
import type { Metadata } from "next";
import { getServices } from "@/actions/service-action";
import { Sparkles } from "lucide-react";
import { ServiceCard } from "@/components/sections/service-card";

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
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-medium text-white/90">
                What we offer
              </span>
            </div>

            <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Services built for{" "}
              <span className="relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                  growth
                </span>
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-slate-400 max-w-2xl">
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
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-100 mb-6">
                <svg
                  className="w-10 h-10 text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No services yet
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                We&apos;re currently updating our service offerings. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
