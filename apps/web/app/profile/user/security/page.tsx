"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Shield,
} from "lucide-react";
import FormField from "@/components/forms/form-field";
import PrimaryButton from "@/components/ui/primary-button";
import SubmittingLoader from "@/components/dashboard/submitting-loader";
import { changePassword, signOut } from "@/lib/auth-client";

export default function SecurityPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearAllCookies = () => {
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        setError(error.message || "Failed to change password");
      } else {
        setSuccess("Password changed successfully. Redirecting to login...");

        setTimeout(async () => {
          await signOut();
          clearAllCookies();
          router.push("/login");
        }, 1500);
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {isSaving && <SubmittingLoader status="Updating password" />}

      {/* Security Info Card */}
      <div className="flex items-start gap-4 bg-white rounded-2xl border border-slate-200 p-6 ">
        <div className="p-3 bg-primarymain/10 rounded-xl">
          <Shield className="size-5 text-primarymain" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Password & Security
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Ensure your account stays secure by using a strong, unique password.
            You&apos;ll be logged out after changing your password.
          </p>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-white rounded-2xl border border-slate-200  overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-linear-to-r from-slate-50/80 to-transparent">
          <h2 className="text-sm font-bold text-slate-900">Change Password</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Update your password regularly to keep your account secure
          </p>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
              <CheckCircle className="size-4 shrink-0" />
              {success}
            </div>
          )}

          <div className="space-y-5">
            <FormField
              label="Current Password"
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              icon={Lock}
              disabled={isSaving}
              required
              suffix={
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              }
            />

            <FormField
              label="New Password"
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              icon={Lock}
              disabled={isSaving}
              required
              suffix={
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              }
            />
            {newPassword && newPassword.length < 8 && (
              <p className="text-[11px] text-amber-600 -mt-3">
                Password must be at least 8 characters
              </p>
            )}

            <FormField
              label="Confirm New Password"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              icon={Lock}
              disabled={isSaving}
              required
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-[11px] text-amber-600 -mt-3">
                Passwords do not match
              </p>
            )}
          </div>

          <div className="flex items-center justify-end pt-2">
            <PrimaryButton
              type="submit"
              text={isSaving ? "Updating..." : "Update Password"}
              disabled={isSaving}
              className="rounded-xl"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
