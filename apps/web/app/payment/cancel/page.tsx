"use client";

import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-10 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-12 w-12 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Cancelled</h1>
          <p className="text-slate-500 mb-6">
            You have cancelled the payment. No charges have been made.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors py-3"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
