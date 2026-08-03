import { getServices } from "@/actions/service-action";
import { Check } from "lucide-react";
import Link from "next/link";

export default async function ServicesSection() {
  const services = await getServices();

  if (services.length === 0) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 ring-1 ring-inset ring-indigo-500/20">
            Our Services
          </span>
          <h2 className="mt-8 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            What we <span className="text-primarymain">offer.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600 max-w-2xl mx-auto">
            Professional solutions tailored to your business needs.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services
            .filter((s) => s.isActive)
            .map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group relative bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-950/5 hover:shadow-xl hover:ring-primarymain/20 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primarymain transition-colors">
                  {service.name}
                </h3>

                {service.shortDescription && (
                  <p className="mt-2 text-sm text-slate-500">
                    {service.shortDescription}
                  </p>
                )}

                {/* Pricing */}
                <div className="mt-6 flex items-baseline gap-2">
                  {service.offerPrice ? (
                    <>
                      <span className="text-sm text-slate-400 line-through">
                        {formatPrice(service.price)}
                      </span>
                      <span className="text-2xl font-extrabold text-primarymain">
                        {formatPrice(service.offerPrice)}
                      </span>
                    </>
                  ) : service.price ? (
                    <span className="text-2xl font-extrabold text-primarymain">
                      {formatPrice(service.price)}
                    </span>
                  ) : null}
                </div>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <ul className="mt-6 space-y-2.5">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <Check className="size-4 mt-0.5 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-8 text-sm font-semibold text-primarymain group-hover:underline">
                  Learn more →
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
