"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";

const TOKEN_COOKIE_NAME = "admin_token";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove(TOKEN_COOKIE_NAME, { path: "/" });
    router.push("/login");
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  );
}
