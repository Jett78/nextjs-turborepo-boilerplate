"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PrimaryButton from "@/components/ui/primary-button";
import FormField from "@/components/forms/form-field";
import { useCrud } from "@/hooks/useCRUD";
import { useForm } from "@/hooks/useForm";
import { API_ROUTES } from "@/config/api-routes";
import { showSuccess, showError } from "@/lib/toast-helper";
import SubmittingLoader from "@/components/dashboard/submitting-loader";
import {  Key, Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

export function PaymentSettingsForm() {
  const router = useRouter();
  const [showSecretKey, setShowSecretKey] = useState(false);

  const { getOne, create, put } = useCrud({
    endpoint: API_ROUTES.PAYMENT_SETTINGS,
    queryKey: "payment-settings",
    isAuthenticated: true,
  });

  const { data: settings, isLoading: isLoadingSettings } = getOne("khalti");

  const { values, handleChange, setField } = useForm({
    secretKey: "",
    publicKey: "",
    apiUrl: "https://a.khalti.com/api/v2",
    isEnabled: "false",
  });

  useEffect(() => {
    if (settings) {
      setField("secretKey", settings.secretKey || "");
      setField("publicKey", settings.publicKey || "");
      setField("apiUrl", settings.apiUrl || "https://a.khalti.com/api/v2");
      setField("isEnabled", settings.isEnabled?.toString() || "false");
    }
  }, [settings]);

  const isEditing = !!settings;
  const isPending = isEditing ? put.isPending : create.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      secretKey: values.secretKey,
      publicKey: values.publicKey,
      apiUrl: values.apiUrl,
      isEnabled: values.isEnabled === "true",
    };

    if (isEditing) {
      put.mutate(
        { id: "khalti", data: payload },
        {
          onSuccess: async (res: any) => {
            if (res.success) {
              showSuccess("Payment settings updated successfully");
              router.refresh();
            }
          },
          onError: (error: any) => {
            showError(error.message || "Failed to update payment settings");
          },
        }
      );
    } else {
      create.mutate(payload as any, {
        onSuccess: async (res: any) => {
          if (res.success) {
            showSuccess("Payment settings created successfully");
            router.refresh();
          }
        },
        onError: (error: any) => {
          showError(error.message || "Failed to create payment settings");
        },
      });
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
        <span className="ml-3 text-slate-600">Loading payment settings...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isPending && <SubmittingLoader status="Saving payment settings" />}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Khalti Configuration */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-xl">
                  <img src="/icons/khalti.png" alt="Khalti" className="h-5 w-5 object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Khalti Configuration</h3>
                  <p className="text-xs text-slate-500">Set up your Khalti payment gateway credentials</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Status Badge */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
                <div className={`h-3 w-3 rounded-full ${values.isEnabled === "true" ? "bg-green-500" : "bg-slate-300"}`} />
                <span className="text-sm font-medium text-slate-700">
                  {values.isEnabled === "true" ? "Khalti Payments Enabled" : "Khalti Payments Disabled"}
                </span>
              </div>

              {/* Secret Key */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <Key className="h-3.5 w-3.5" />
                  Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showSecretKey ? "text" : "password"}
                    name="secretKey"
                    value={values.secretKey}
                    onChange={handleChange}
                    placeholder="Enter your Khalti secret key"
                    className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-10 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/20 focus-visible:border-purple-500/50 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showSecretKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Public Key */}
              <FormField
                label="Public Key"
                name="publicKey"
                value={values.publicKey}
                onChange={handleChange}
                placeholder="Enter your Khalti public key"
              />

              {/* API URL */}
              <FormField
                label="API URL"
                name="apiUrl"
                value={values.apiUrl}
                onChange={handleChange}
                placeholder="https://a.khalti.com/api/v2"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          {/* Enable/Disable */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-xl">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Payment Status</h3>
                  <p className="text-xs text-slate-500">Enable or disable Khalti payments</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isEnabled"
                    checked={values.isEnabled === "true"}
                    onChange={(e) => handleChange({ target: { name: "isEnabled", value: e.target.checked ? "true" : "false" } } as any)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-900 group-hover:text-slate-700">
                    Enable Khalti Payments
                  </span>
                  <p className="text-xs text-slate-500">
                    Allow customers to pay via Khalti on your website
                  </p>
                </div>
              </label>

              {/* Info Box */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <h4 className="text-xs font-bold text-blue-800 mb-2">How it works</h4>
                <ul className="text-xs text-blue-700 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">1.</span>
                    Enter your Khalti credentials above
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">2.</span>
                    Enable payments when ready
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">3.</span>
                    Customers will see Khalti as a payment option
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">4.</span>
                    Payments are verified server-side for security
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <PrimaryButton
          type="submit"
          text={isEditing ? "Save Changes" : "Create Settings"}
          disabled={isPending}
        />
      </div>
    </form>
  );
}
