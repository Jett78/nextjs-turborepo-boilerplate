"use client";

import { API_ROUTES } from "@/config/api-routes";
import { useCrud } from "@/hooks/useCRUD";
import { useForm } from "@/hooks/useForm";
import { showSuccess, showError } from "@/lib/toast-helper";
import { Loader2, CreditCard} from "lucide-react";

export default function TestPaymentPage() {
  const { create } = useCrud<any>({
    endpoint: `${API_ROUTES.KHALTI}/initiate`,
    queryKey: "khalti-initiate",
    isAuthenticated: true,
  });

  const { values, handleChange } = useForm({
    amount: "1000",
    productName: "Test Product",
    productId: "TEST-001",
    customerName: "Test User",
    customerEmail: "test@example.com",
    customerPhone: "9800000001",
  });


  const handleInitiatePayment = () => {
    create.mutate(
      {
        amount: Number(values.amount),
        productName: values.productName,
        productId: values.productId,
        returnUrl: `${window.origin}/payment/success`,
        websiteUrl: window.origin,
        customerInfo: {
          name: values.customerName,
          email: values.customerEmail,
          phone: values.customerPhone,
        },
      },
      {
        onSuccess: (res: any) => {
          if (res.success && res.data?.payment_url) {
            showSuccess("Payment initiated! Redirecting to Khalti...");
            setTimeout(() => {
              window.location.href = res.data.payment_url;
            }, 1500);
          } else {
            showError(res.message || "Failed to initiate payment");
          }
        },
        onError: (error: any) => {
          showError(error.message || "An error occurred");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            <CreditCard className="h-4 w-4" />
            Khalti Payment Test
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Test Payment Gateway</h1>
          <p className="text-slate-500 mt-2">
            Fill in the details below to test Khalti payment integration
          </p>
        </div>

        {/* Test Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-slate-50">
            <h2 className="text-lg font-bold text-slate-900">Payment Details</h2>
            <p className="text-sm text-slate-500">Enter test payment information</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Amount (NPR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                  Rs.
                </span>
                <input
                  type="number"
                  name="amount"
                  value={values.amount}
                  onChange={handleChange}
                  min={10}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                />
              </div>
              <p className="text-xs text-slate-400">Minimum amount is Rs. 10</p>
            </div>

            {/* Product Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={values.productName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Product ID</label>
                <input
                  type="text"
                  name="productId"
                  value={values.productId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                />
              </div>
            </div>

            {/* Customer Info */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-700 mb-4">Customer Information</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={values.customerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">Email</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={values.customerEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">Phone</label>
                  <input
                    type="text"
                    name="customerPhone"
                    value={values.customerPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Test Credentials Info */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <h4 className="text-xs font-bold text-amber-800 mb-2">Sandbox Test Credentials</h4>
              <div className="text-xs text-amber-700 space-y-1">
                <p>Test Khalti ID: <code className="bg-amber-100 px-1.5 py-0.5 rounded">9800000001</code></p>
                <p>Test MPIN: <code className="bg-amber-100 px-1.5 py-0.5 rounded">1111</code></p>
                <p>Test OTP: <code className="bg-amber-100 px-1.5 py-0.5 rounded">987654</code></p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleInitiatePayment}
              disabled={create.isPending || Number(values.amount) < 10}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold text-sm hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {create.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Pay Rs. {Number(values.amount).toLocaleString()} with Khalti
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
