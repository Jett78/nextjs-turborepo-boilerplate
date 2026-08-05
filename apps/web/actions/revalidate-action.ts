"use server";

import { revalidateTag } from "next/cache";

export async function revalidateBlogs() {
  revalidateTag("blogs", "max");
}

export async function revalidateBlog(slug: string) {
  revalidateTag("blogs", "max");
  revalidateTag(`blog-${slug}`, "max");
}

export async function revalidateCompanyProfile() {
  revalidateTag("company-profile", "max");
}

export async function revalidateTestimonials() {
  revalidateTag("testimonials", "max");
}

export async function revalidateFaqs() {
  revalidateTag("faqs", "max");
}

export async function revalidateTeamMembers() {
  revalidateTag("team-members", "max");
}

export async function revalidateTeamMember(slug: string) {
  revalidateTag("team-members", "max");
  revalidateTag(`team-member-${slug}`, "max");
}

export async function revalidateServices() {
  revalidateTag("services", "max");
}

export async function revalidateService(slug: string) {
  revalidateTag("services", "max");
  revalidateTag(`service-${slug}`, "max");
}

export async function revalidateRedirects() {
  revalidateTag("redirects", "max");
}

export async function revalidateNavigation() {
  revalidateTag("navigation", "max");
}
