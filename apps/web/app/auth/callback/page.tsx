"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const fetchRoleAndRedirect = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/profile`,
          { credentials: "include" }
        );
        const data = await response.json();
        const role = data?.data?.role || "user";

        document.cookie = `user_role=${role}; path=/; max-age=${60 * 60 * 24 * 7}`;

        if (role === "admin" || role === "super_admin") {
          router.push("/dashboard");
        } else {
          router.push("/profile/user");
        }
      } catch {
        router.push("/login");
      }
    };

    fetchRoleAndRedirect();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Signing you in...</p>
    </div>
  );
}
