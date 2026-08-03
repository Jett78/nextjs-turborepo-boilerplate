import { notFound } from "next/navigation";
import { getServices, getServiceBySlug } from "@/actions/service-action";
import { formatPrice } from "@/lib/utils";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.name} - Services`,
    description: service.shortDescription || service.description?.slice(0, 160) || "",
    openGraph: {
      title: service.name,
      description: service.shortDescription || "",
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) notFound();

  // Get related services
  const allServices = await getServices();
  const relatedServices = allServices
    .filter((s) => s.id !== service.id && s.isActive)
    .slice(0, 3);

  return (
    <section className="py-24 sm:py-32 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primarymain transition-colors mb-12"
        >
          <ArrowLeft className="size-4" />
          Back to Services
        </Link>

        <div className="bg-white rounded-3xl shadow-sm ring-1 ring-gray-950/5 overflow-hidden">
          {/* Hero Image */}
          {service.imageKey && (
            <div className="relative h-64 sm:h-80 overflow-hidden">
              <img
                src={service.imageKey}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Price Badge */}
              {(service.price || service.offerPrice) && (
                <div className="absolute bottom-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-xl">
                    {service.offerPrice ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-base text-slate-400 line-through">
                          {formatPrice(service.price)}
                        </span>
                        <span className="text-2xl font-extrabold text-primarymain">
                          {formatPrice(service.offerPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-extrabold text-primarymain">
                        {formatPrice(service.price)}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Header */}
          <div className={`p-8 sm:p-12 ${service.imageKey ? "" : "bg-gradient-to-br from-primarymain to-indigo-700 text-white"}`}>
            <h1 className={`text-3xl sm:text-4xl font-extrabold ${service.imageKey ? "text-slate-900" : "text-white"}`}>
              {service.name}
            </h1>
            {service.shortDescription && (
              <p className={`mt-3 text-lg ${service.imageKey ? "text-slate-500" : "text-white/80"}`}>
                {service.shortDescription}
              </p>
            )}
          </div>

          <div className="p-8 sm:p-12 space-y-10">
            {/* Price (no image) */}
            {!service.imageKey && (service.price || service.offerPrice) && (
              <div className="text-center py-6 border-y border-slate-100">
                {service.offerPrice ? (
                  <div className="flex items-baseline justify-center gap-3">
                    <span className="text-xl text-slate-400 line-through">
                      {formatPrice(service.price)}
                    </span>
                    <span className="text-4xl font-extrabold text-primarymain">
                      {formatPrice(service.offerPrice)}
                    </span>
                  </div>
                ) : (
                  <span className="text-4xl font-extrabold text-primarymain">
                    {formatPrice(service.price)}
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            {service.description && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">About this service</h2>
                <div className="w-12 h-1 rounded-full bg-primarymain mb-6" />
                <div className="prose prose-slate max-w-none">
                  <p className="text-base leading-relaxed text-slate-600 whitespace-pre-line">
                    {service.description}
                  </p>
                </div>
              </div>
            )}

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">What&apos;s included</h2>
                <div className="w-12 h-1 rounded-full bg-primarymain mb-6" />
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className="size-5 mt-0.5 text-green-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="pt-6 border-t border-slate-100">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primarymain text-white px-8 py-4 rounded-xl font-semibold hover:bg-primarymain/90 transition-all hover:shadow-lg hover:shadow-primarymain/25"
              >
                Get Started
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-slate-900 mb-8">Other Services</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((related) => (
                <Link
                  key={related.id}
                  href={`/services/${related.slug}`}
                  className="group bg-white rounded-2xl shadow-sm ring-1 ring-gray-950/5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:ring-primarymain/30 hover:-translate-y-1"
                >
                  {related.imageKey && (
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={related.imageKey}
                        alt={related.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-primarymain transition-colors">
                      {related.name}
                    </h3>
                    {related.shortDescription && (
                      <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                        {related.shortDescription}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primarymain">
                      View Details
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
