"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import PrimaryButton from "@/components/ui/primary-button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Error Icon & Illustration */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-primarymain/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-primarymain/20">
            <AlertCircle className="text-primarymain w-12 h-12" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            We encountered an unexpected error. Don&apos;t worry, our team has been
            notified and we&apos;re on it.
          </p>
          {error.digest && (
            <div className="inline-block px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              Error ID: {error.digest}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <PrimaryButton
            text="Try Again"
            onClick={() => window.location.reload()}
            className="w-full justify-center py-4 flex items-center gap-2"
          />

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:border-primarymain hover:text-primarymain transition-all text-sm"
            >
              <Home size={18} />
              Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:border-primarymain hover:text-primarymain transition-all text-sm"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            If the problem persists, please contact{" "}
            <a
              href="mailto:support@lawsagar.com"
              className="text-primarymain font-bold hover:underline"
            >
              support@lawsagar.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
