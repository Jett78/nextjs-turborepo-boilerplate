"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ArrowUpRight, Sparkles, Check } from "lucide-react";

interface ServiceCardProps {
  service: any;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const isFeatured = index === 0;

  return (
    <Link
      href={`/services/${service.slug}`}
      className={`group relative ${
        isFeatured ? "sm:col-span-2 lg:col-span-2" : ""
      }`}
    >
      <div
        className={`relative h-full overflow-hidden rounded-3xl bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 ${
          isFeatured ? "" : ""
        }`}
      >
        {service.imageKey ? (
          <div
            className={`relative overflow-hidden ${
              isFeatured ? "h-72 sm:h-80" : "h-56 sm:h-64"
            }`}
          >
            <img
              src={service.imageKey}
              alt={service.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {isFeatured && (
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  <span className="text-xs font-semibold text-indigo-600">Featured</span>
                </div>
              </div>
            )}

            {(service.price || service.offerPrice) && (
              <div className="absolute top-4 right-4">
                <div className="rounded-xl bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-sm">
                  {service.offerPrice ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(service.price)}
                      </span>
                      <span className="text-sm font-bold text-indigo-600">
                        {formatPrice(service.offerPrice)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-indigo-600">
                      {formatPrice(service.price)}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3
                className={`font-bold text-white transition-colors ${
                  isFeatured ? "text-2xl sm:text-3xl" : "text-xl"
                }`}
              >
                {service.name}
              </h3>

              {(service.shortDescription || service.description) && (
                <p
                  className={`mt-2 text-white/80 leading-relaxed ${
                    isFeatured ? "text-sm sm:text-base line-clamp-2" : "text-sm line-clamp-2"
                  }`}
                >
                  {service.shortDescription || service.description}
                </p>
              )}

              {service.features && service.features.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {service.features.slice(0, isFeatured ? 4 : 2).map((feature: string, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm"
                    >
                      <Check className="h-3 w-3" />
                      {feature}
                    </span>
                  ))}
                  {service.features.length > (isFeatured ? 4 : 2) && (
                    <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      +{service.features.length - (isFeatured ? 4 : 2)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h3
                className={`font-bold text-slate-900 transition-colors group-hover:text-indigo-600 ${
                  isFeatured ? "text-2xl sm:text-3xl" : "text-xl"
                }`}
              >
                {service.name}
              </h3>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 transition-all duration-300 group-hover:border-indigo-600 group-hover:bg-indigo-600">
                <ArrowUpRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-white" />
              </div>
            </div>

            {(service.shortDescription || service.description) && (
              <p className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-2">
                {service.shortDescription || service.description}
              </p>
            )}

            {service.features && service.features.length > 0 && (
              <div className="mt-5">
                <ul className="space-y-2.5">
                  {service.features.slice(0, 3).map((feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="line-clamp-1">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(service.price || service.offerPrice) && (
              <div className="mt-5 pt-5 border-t border-slate-100">
                {service.offerPrice ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(service.price)}
                    </span>
                    <span className="text-2xl font-extrabold text-indigo-600">
                      {formatPrice(service.offerPrice)}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-extrabold text-indigo-600">
                    {formatPrice(service.price)}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
