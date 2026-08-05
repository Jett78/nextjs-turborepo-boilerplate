"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, signOut } from "@/lib/auth-client";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import PrimaryButton from "@/components/ui/primary-button";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error: signInError } = await signIn.email({ email, password });

      if (signInError) {
        setError(signInError.message || "Login failed");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/profile`,
        { credentials: "include" }
      );
      const data = await response.json();
      const role = data?.data?.role || "user";
      const emailVerified = data?.data?.emailVerified;

      document.cookie = `user_role=${role}; path=/; max-age=${60 * 60 * 24 * 7}`;

      if (role === "admin" || role === "super_admin" || role === "editor" || role === "manager") {
        if (!emailVerified) {
          await signOut();
          window.location.href = `/verify-email?email=${encodeURIComponent(email)}&name=${encodeURIComponent(data?.data?.name || "")}`;
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        setError("Access denied. Admin credentials required.");
        await signOut();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10">
            <Shield className="h-6 w-6 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-slate-900 p-8 shadow-sm ring-1 ring-slate-800">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-10 pr-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-10 pr-12 py-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <PrimaryButton
            text={isLoading ? "Signing in..." : "Sign In"}
            type="submit"
            disabled={isLoading}
            className="w-full !py-3.5"
          />
        </form>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to user login
          </Link>
        </div>
      </div>
    </div>
  );
}
