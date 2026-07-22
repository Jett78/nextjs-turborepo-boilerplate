import { cookies } from "next/headers";

const TOKEN_COOKIE_NAME = "admin_token";

export async function getServerAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value;
}
