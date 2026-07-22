"use client";

import Link from "next/link";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteBlogButton } from "./delete-blog-button";
import type { Blog } from "@/types/blog";

export function BlogList() {
  const { getAll } = useCrud<Blog>({
    endpoint: API_ROUTES.BLOG,
    queryKey: "blogs",
  });

  const { data, isLoading, isError } = getAll({ take: 50, isActive: true });

  if (isLoading) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        Loading blogs...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border p-8 text-center text-destructive">
        Failed to load blogs. Please try again.
      </div>
    );
  }

  const blogs = data || [];

  if (blogs.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        No blogs found. Create your first blog post!
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell className="font-medium">{blog.title}</TableCell>
              <TableCell className="text-muted-foreground">
                {blog.slug}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    blog.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {blog.isActive ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(blog.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <DeleteBlogButton id={blog.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
