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

export async function revalidateFaqs() {
  revalidateTag("faqs", "updateTag");
}

export async function revalidateTeamMembers() {
  revalidateTag("team-members", "updateTag");
}

export async function revalidateTeamMember(slug: string) {
  revalidateTag("team-members", "updateTag");
  revalidateTag(`team-member-${slug}`, "updateTag");
}

export async function revalidateServices() {
  revalidateTag("services", "updateTag");
}

export async function revalidateService(slug: string) {
  revalidateTag("services", "updateTag");
  revalidateTag(`service-${slug}`, "updateTag");
}
