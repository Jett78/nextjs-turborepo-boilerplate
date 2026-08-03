import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { getServices } from "@/actions/service-action";
import { formatPrice } from "@/lib/utils";
import PageHeader from "@/components/ui/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services - Jeet Deula",
  description: "Professional web development services tailored to your business needs.",
};

export default async function ServicesPage() {
  const services = await getServices();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-24 sm:py-32 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <PageHeader
            title="Our Services"
            subtitle="What We Offer"
            desc="Professional solutions crafted to elevate your digital presence and drive business growth."
          />
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group relative bg-white rounded-2xl shadow-sm ring-1 ring-gray-950/5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:ring-primarymain/30 hover:-translate-y-1"
              >
                {/* Image */}
                {service.imageKey && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.imageKey}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Price Badge */}
                    {(service.price || service.offerPrice) && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-lg">
                          {service.offerPrice ? (
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-xs text-slate-400 line-through">
                                {formatPrice(service.price)}
                              </span>
                              <span className="text-sm font-bold text-primarymain">
                                {formatPrice(service.offerPrice)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm font-bold text-primarymain">
                              {formatPrice(service.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primarymain transition-colors">
                    {service.name}
                  </h3>

                  {/* Description */}
                  {(service.shortDescription || service.description) && (
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {service.shortDescription || service.description}
                    </p>
                  )}

                  {/* Features Preview */}
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2 pt-2">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <Check className="size-4 text-green-500 shrink-0" />
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                      {service.features.length > 3 && (
                        <li className="text-xs text-slate-400 pl-6">
                          +{service.features.length - 3} more
                        </li>
                      )}
                    </ul>
                  )}

                  {/* No Image Price */}
                  {!service.imageKey && (service.price || service.offerPrice) && (
                    <div className="pt-2">
                      {service.offerPrice ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-slate-400 line-through">
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
                  )}

                  {/* CTA */}
                  <div className="pt-4 flex items-center gap-2 text-sm font-semibold text-primarymain group-hover:gap-3 transition-all">
                    View Details
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-6">
              <svg
                className="w-8 h-8 text-slate-400"
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
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Services Available
            </h3>
            <p className="text-sm text-slate-500">
              We&apos;re currently updating our service offerings. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
