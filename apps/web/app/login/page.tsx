"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
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
      const { error } = await signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Login failed");
      } else {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/profile`,
          { credentials: "include" }
        );
        const data = await response.json();
        const role = data?.data?.role || "user";
        const emailVerified = data?.data?.emailVerified;

        document.cookie = `user_role=${role}; path=/; max-age=${60 * 60 * 24 * 7}`;

        if (role === "admin" || role === "super_admin") {
          setError("Admin users please use the admin login page.");
          await signIn.signOut();
        } else if (!emailVerified) {
          // Email not verified, sign out and redirect to verify-email
          await signIn.signOut();
          router.push(`/verify-email?email=${encodeURIComponent(email)}&name=${encodeURIComponent(data?.data?.name || "")}`);
        } else {
          router.push("/profile/user");
        }
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/auth/callback",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border p-6 shadow-sm"
        >
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            Sign in with Google
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>

        <p className="text-center text-sm text-muted-foreground">
          <a href="/admin" className="text-slate-500 hover:text-slate-700">
            Admin Login →
          </a>
        </p>
      </div>
    </div>
  );
}
