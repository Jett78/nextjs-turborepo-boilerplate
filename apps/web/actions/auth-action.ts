"use server";

import { authClient } from "@/lib/auth-client";

export async function logoutAction(): Promise<void> {
  await authClient.signOut();
}
