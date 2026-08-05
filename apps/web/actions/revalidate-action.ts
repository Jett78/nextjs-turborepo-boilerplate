"use server";

import { revalidateTag } from "next/cache";

export async function revalidateBlogs() {
  revalidateTag("blogs");
}

export async function revalidateBlog(slug: string) {
  revalidateTag("blogs");
  revalidateTag(`blog-${slug}`);
}

export async function revalidateCompanyProfile() {
  revalidateTag("company-profile");
}

export async function revalidateTestimonials() {
  revalidateTag("testimonials");
}

export async function revalidateFaqs() {
  revalidateTag("faqs");
}

export async function revalidateTeamMembers() {
  revalidateTag("team-members");
}

export async function revalidateTeamMember(slug: string) {
  revalidateTag("team-members");
  revalidateTag(`team-member-${slug}`);
}

export async function revalidateServices() {
  revalidateTag("services");
}

export async function revalidateService(slug: string) {
  revalidateTag("services");
  revalidateTag(`service-${slug}`);
}

export async function revalidateRedirects() {
  revalidateTag("redirects");
}

export async function revalidateNavigation() {
  revalidateTag("navigation");
}
