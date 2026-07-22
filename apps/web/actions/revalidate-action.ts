"use server";

import { revalidatePath } from "next/cache";

export async function revalidateBlogs() {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/dashboard/blogs");
}

export async function revalidateBlog(slug: string) {
  revalidatePath("/");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/dashboard/blogs");
}
