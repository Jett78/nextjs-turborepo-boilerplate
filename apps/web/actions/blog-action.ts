"use server";

import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import type { Blog, BlogListResponse, BlogResponse } from "@/types/blog";
import type { GetBlogsParams } from "@/types/components";

export async function getBlogs(params?: GetBlogsParams): Promise<Blog[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.skip !== undefined) searchParams.set("skip", String(params.skip));
    if (params?.take !== undefined) searchParams.set("take", String(params.take));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.isActive !== undefined) searchParams.set("isActive", String(params.isActive));

    const query = searchParams.toString();
    const url = query ? `${API_ROUTES.BLOG}?${query}` : API_ROUTES.BLOG;

    const response = await apiClient<BlogListResponse>(url, {
      next: { tags: ["blogs"] },
    });

    if (!response || !response.success || !response.data) return [];
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const response = await apiClient<BlogResponse>(
      `${API_ROUTES.BLOG}/slug/${slug}`,
      { next: { tags: [`blog-${slug}`, "blogs"] } }
    );

    if (!response || !response.success || !response.data) return null;
    return response.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export async function getBlogById(id: string): Promise<Blog | null> {
  try {
    const response = await apiClient<BlogResponse>(
      `${API_ROUTES.BLOG}/${id}`,
      { next: { tags: [`blog-${id}`] } }
    );

    if (!response || !response.success || !response.data) return null;
    return response.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const response = await apiClient<BlogListResponse>(
      `${API_ROUTES.BLOG}?take=1000&isActive=true`,
      { next: { tags: ["blogs"] } }
    );

    if (!response || !response.success || !response.data) return [];
    return response.data.data?.map((blog) => blog.slug) || [];
  } catch (error) {
    console.error("Error fetching blog slugs:", error);
    return [];
  }
}
