"use client";

import { useState } from "react";
import { Bell, Mail, CheckCircle } from "lucide-react";
import PrimaryButton from "@/components/ui/primary-button";
import SubmittingLoader from "@/components/dashboard/submitting-loader";
import { showSuccess } from "@/lib/toast-helper";

export default function AccountSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showSuccess("Settings saved successfully!");
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {isSaving && <SubmittingLoader status="Saving settings" />}

      {/* Notification Info Card */}
      <div className="flex items-start gap-4 bg-white rounded-2xl border border-slate-200 p-6 ">
        <div className="p-3 bg-blue-50 rounded-xl">
          <Bell className="size-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Notification Preferences
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Choose how you want to be notified about account activity and
            updates.
          </p>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl border border-slate-200  overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-linear-to-r from-slate-50/80 to-transparent">
          <h2 className="text-sm font-bold text-slate-900">Email Notifications</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your email notification settings
          </p>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-blue-50 rounded-lg">
                  <Mail className="size-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Email Notifications
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Receive email updates about your account activity.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primarymain" />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-purple-50 rounded-lg">
                  <CheckCircle className="size-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Marketing Emails
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Receive emails about new features and updates.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingEmails}
                  onChange={(e) => setMarketingEmails(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primarymain" />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <PrimaryButton
              type="submit"
              text={isSaving ? "Saving..." : "Save Changes"}
              disabled={isSaving}
              className="rounded-xl"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
