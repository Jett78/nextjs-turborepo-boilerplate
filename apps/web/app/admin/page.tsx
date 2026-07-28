"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error: signInError } = await signIn.email({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Login failed");
        setIsLoading(false);
        return;
      }

      // Wait a bit for session to be established
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/profile`,
        { credentials: "include" }
      );
      const data = await response.json();
      const role = data?.data?.role || "user";

      document.cookie = `user_role=${role}; path=/; max-age=${60 * 60 * 24 * 7}`;

      if (role === "admin" || role === "super_admin") {
        window.location.href = "/dashboard";
      } else {
        setError("Access denied. Admin credentials required.");
        await signIn.signOut();
        setIsLoading(false);
      }
    } catch {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Shield className="size-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-sm"
        >
          {error && (
            <div className="rounded-md bg-rose-500/15 p-3 text-sm text-rose-400 border border-rose-500/20">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-400">
          <a href="/login" className="text-primary hover:underline">
            ← Back to user login
          </a>
        </p>
      </div>
    </div>
  );
}
