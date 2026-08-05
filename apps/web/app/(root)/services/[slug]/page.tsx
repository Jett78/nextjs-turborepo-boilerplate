import { notFound } from "next/navigation";
import { getServices, getServiceBySlug } from "@/actions/service-action";
import { formatPrice } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
  MessageSquare,
} from "lucide-react";
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
    description:
      service.shortDescription || service.description?.slice(0, 160) || "",
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

  const allServices = await getServices();
  const relatedServices = allServices
    .filter((s) => s.id !== service.id && s.isActive)
    .slice(0, 3);

  return (
    <section className="relative overflow-hidden">
      {/* Hero */}
      <div className="relative bg-slate-900 pt-24 pb-16 sm:pt-32 sm:pb-24">
        {/* Background */}
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

        {/* Hero Image Overlay */}
        {service.imageKey && (
          <div className="absolute inset-0">
            <img
              src={service.imageKey}
              alt={service.name}
              className="h-full w-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/60" />
          </div>
        )}

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white mb-12"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-medium text-white/90">
                Our Service
              </span>
            </div>

            <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {service.name}
            </h1>

            {service.shortDescription && (
              <p className="mt-6 text-lg leading-relaxed text-slate-400 max-w-2xl">
                {service.shortDescription}
              </p>
            )}

            {/* Price */}
            {(service.price || service.offerPrice) && (
              <div className="mt-8 inline-flex items-baseline gap-3 rounded-2xl bg-white/10 px-6 py-4 backdrop-blur-sm">
                {service.offerPrice ? (
                  <>
                    <span className="text-lg text-slate-400 line-through">
                      {formatPrice(service.price)}
                    </span>
                    <span className="text-3xl font-extrabold text-white">
                      {formatPrice(service.offerPrice)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-extrabold text-white">
                    {formatPrice(service.price)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Service Image */}
              {service.imageKey && (
                <div className="rounded-3xl overflow-hidden shadow-sm ring-1 ring-slate-900/5">
                  <img
                    src={service.imageKey}
                    alt={service.name}
                    className="w-full h-auto object-cover max-h-[500px]"
                  />
                </div>
              )}

              {/* Gallery */}
              {service.gallery && service.gallery.length > 0 && (
                <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-900/5">
                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    Gallery
                  </h2>
                  <div className="h-1 w-12 rounded-full bg-indigo-600 mb-6" />
                  <div className="grid grid-cols-2 gap-4">
                    {service.gallery.map((image, i) => (
                      <div
                        key={i}
                        className="relative aspect-square overflow-hidden rounded-2xl"
                      >
                        <img
                          src={image}
                          alt={`${service.name} gallery ${i + 1}`}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {service.description && (
                <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-sm ring-1 ring-slate-900/5">
                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    About this service
                  </h2>
                  <div className="h-1 w-12 rounded-full bg-indigo-600 mb-6" />
                  <div className="prose prose-slate max-w-none">
                    <p className="text-base leading-relaxed text-slate-600 whitespace-pre-line">
                      {service.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-sm ring-1 ring-slate-900/5">
                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    What&apos;s included
                  </h2>
                  <div className="h-1 w-12 rounded-full bg-emerald-500 mb-6" />
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {service.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 mt-0.5">
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* CTA Card */}
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Ready to get started?
                  </h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Contact us today to discuss your project requirements.
                  </p>
                  <Link
                    href="/contact"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/25"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Get in Touch
                  </Link>
                </div>

                {/* Quick Stats */}
                {(service.price || service.offerPrice) && (
                  <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">
                      Pricing Details
                    </h3>
                    <div className="space-y-4">
                      {service.offerPrice && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">You save</span>
                          <span className="text-sm font-bold text-emerald-600">
                            {formatPrice((service.price ?? 0) - (service.offerPrice ?? 0))}
                          </span>
                        </div>
                      )}
                      <div className="pt-4 border-t border-slate-100">
                        <div className="text-sm text-slate-500 mb-1">Starting from</div>
                        <div className="text-2xl font-extrabold text-indigo-600">
                          {formatPrice(service.offerPrice || service.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Services */}
          {relatedServices.length > 0 && (
            <div className="mt-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  Other Services
                </h2>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedServices.map((related) => (
                  <Link
                    key={related.id}
                    href={`/services/${related.slug}`}
                    className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white transition-all duration-500 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-200/50"
                  >
                    {related.imageKey && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={related.imageKey}
                          alt={related.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {related.name}
                      </h3>
                      {related.shortDescription && (
                        <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                          {related.shortDescription}
                        </p>
                      )}
                      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
                        View Details
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
