import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

export default function ServiceNotFound() {
  return (
    <section className="relative overflow-hidden">
      {/* Hero */}
      <div className="relative bg-slate-900 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm mb-8">
            <Package className="h-12 w-12 text-slate-400" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Service Not Found
          </h1>

          <p className="text-lg text-slate-400 mb-10 max-w-md mx-auto">
            The service you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-100 hover:shadow-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>
        </div>
      </div>

      {/* Decorative bottom curve */}
      <div className="relative bg-slate-50 h-32">
        <div className="absolute -top-16 left-0 right-0 h-32 bg-slate-900 rounded-b-[3rem]" />
      </div>
    </section>
  );
}
