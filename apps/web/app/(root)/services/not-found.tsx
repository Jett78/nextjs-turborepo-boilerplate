import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

export default function ServiceNotFound() {
  return (
    <section className="py-24 sm:py-32 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-8">
          <Package className="w-10 h-10 text-slate-400" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Service Not Found
        </h1>

        <p className="text-lg text-slate-500 mb-8 max-w-md mx-auto">
          The service you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 bg-primarymain text-white px-6 py-3 rounded-xl font-semibold hover:bg-primarymain/90 transition-all"
        >
          <ArrowLeft className="size-5" />
          Back to Services
        </Link>
      </div>
    </section>
  );
}
