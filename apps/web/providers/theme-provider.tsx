"use client";

import { useEffect } from "react";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import type { CompanyProfile } from "@/types/company-profile";

function hslStringToHex(hsl: string): string {
  const parts = hsl.replace(/%/g, "").split(" ");
  const h = parseFloat(parts[0]) || 0;
  let s = parseFloat(parts[1]) || 0;
  let l = parseFloat(parts[2]) || 0;

  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { getAll } = useCrud<CompanyProfile>({
    endpoint: API_ROUTES.COMPANY_PROFILE,
    queryKey: "company-profile",
  });

  const { data } = getAll();

  useEffect(() => {
    if (data) {
      const profile = data as CompanyProfile;
      const root = document.documentElement;

      if (profile.primaryColor) {
        const hex = hslStringToHex(profile.primaryColor);
        root.style.setProperty("--primarymain", hex);
        root.style.setProperty("--color-primarymain", hex);
      }
      if (profile.secondaryColor) {
        const hex = hslStringToHex(profile.secondaryColor);
        root.style.setProperty("--secondarymain", hex);
        root.style.setProperty("--color-secondarymain", hex);
      }
    }
  }, [data]);

  return <>{children}</>;
}
