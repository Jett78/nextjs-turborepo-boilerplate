"use server";

import { revalidateTag } from "next/cache";

export async function revalidateRedirects() {
  revalidateTag("redirects", "updateTag");
}
