"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import { CheckCircle, XCircle, Loader2, ArrowLeft, Receipt } from "lucide-react";
import type { Order } from "@/types/khalti";

interface CallbackData {
  pidx: string;
  status: string;
  transactionId: string;
  amount: string;
  purchaseOrderId: string;
  purchaseOrderName: string;
  verification: any;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const pidx = searchParams.get("pidx");
  const txnStatus = searchParams.get("status");

  const { getAll: getCallback } = useCrud<CallbackData>({
    endpoint: `${API_ROUTES.KHALTI}/callback`,
    queryKey: "khalti-callback",
    isAuthenticated: false,
  });

  const { getAll: getOrder } = useCrud<Order>({
    endpoint: API_ROUTES.KHALTI_ORDER,
    queryKey: "khalti-order",
    isAuthenticated: true,
  });

  const { data: callbackData, isLoading: isCallbackLoading } = getCallback(
    pidx && txnStatus === "Completed" ? { pidx, status: txnStatus } : undefined
  );

  const { data: orderData, isLoading: isOrderLoading } = getOrder(
    pidx ? { pidx } : undefined
  );

  const getStatus = () => {
    if (!pidx || txnStatus !== "Completed") return "failed";
    if (isCallbackLoading || isOrderLoading) return "loading";
    if (orderData?.status === "Pending") return "pending";
    if (orderData?.status === "Completed" || callbackData?.verification?.status === "Completed") return "success";
    return "failed";
  };

  const currentStatus = getStatus();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {currentStatus === "loading" && (
          <div className="p-10 text-center">
            <Loader2 className="h-16 w-16 text-blue-500 mx-auto animate-spin mb-4" />
            <h1 className="text-xl font-bold text-slate-900 mb-2">Verifying Payment</h1>
            <p className="text-slate-500">Please wait while we confirm your payment...</p>
          </div>
        )}

        {currentStatus === "success" && (
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
            <p className="text-slate-500 mb-6">
              Your payment has been processed successfully.
            </p>

            {orderData && (
              <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Receipt className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-700">Order Details</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Order ID</span>
                  <span className="font-mono font-medium text-slate-900">
                    {orderData.orderId}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Product</span>
                  <span className="font-medium text-slate-900">
                    {orderData.productName}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-medium text-slate-900">
                    Rs. {orderData.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className="font-medium text-green-600 capitalize">
                    {orderData.status}
                  </span>
                </div>
              </div>
            )}

            {!orderData && callbackData?.verification && (
              <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Transaction ID</span>
                  <span className="font-mono font-medium text-slate-900">
                    {callbackData.transactionId}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-medium text-slate-900">
                    Rs. {(callbackData.verification.totalAmount / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        )}

        {currentStatus === "pending" && (
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-12 w-12 text-yellow-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Pending</h1>
            <p className="text-slate-500 mb-6">
              Your payment is being processed. Please check back later.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        )}

        {currentStatus === "failed" && (
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Failed</h1>
            <p className="text-slate-500 mb-6">
              Something went wrong with your payment. Please try again.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
