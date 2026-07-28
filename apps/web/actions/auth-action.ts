"use server";

import { cookies } from "next/headers";
import { authClient } from "@/lib/auth-client";

export async function logoutAction(): Promise<void> {
  await authClient.signOut();
  
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  for (const cookie of allCookies) {
    cookieStore.delete(cookie.name);
  }
}
