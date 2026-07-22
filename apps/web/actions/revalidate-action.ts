"use server";

import { revalidateTag } from "next/cache";

export async function revalidateBlogs() {
  revalidateTag("blogs", "updateTag");
}

export async function revalidateBlog(slug: string) {
  revalidateTag("blogs", "updateTag");
  revalidateTag(`blog-${slug}`, "updateTag");
}

export async function revalidateCompanyProfile() {
  revalidateTag("company-profile", "updateTag");
}

export async function revalidateTestimonials() {
  revalidateTag("testimonials", "updateTag");
}
