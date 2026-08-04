"use client";

import { useState, useEffect } from "react";
import DashboardHeading from "@/components/dashboard/dashboard-heading";
import { Search, Plus, Calendar, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { EditButton } from "@/components/dashboard/edit-button";
import { revalidateBlogs } from "@/actions/revalidate-action";
import type { Blog } from "@/types/blog";
import Link from "next/link";
import Image from "next/image";

export default function BlogsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { getAll } = useCrud<Blog>({
    endpoint: API_ROUTES.BLOG,
    queryKey: "blogs",
  });

  const { data, isLoading, isError, error } = getAll({ take: 50, isActive: true });

  const blogs = (data as Blog[]) || [];

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    blog.slug.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  if (isError) {
    return (
      <div className="p-8 text-center text-rose-600 font-bold">
        Error: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <DashboardHeading
        title="Blogs"
        description="Manage your blog posts and pages."
        path="blogs"
      />

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="Search by title or slug..."
            className="pl-10 h-11 bg-white border-slate-200 rounded-md focus:ring-primary/20 focus:border-primary transition-all font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
              <div className="aspect-video bg-slate-100" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-3 bg-slate-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <FileText className="size-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No blogs found</h3>
          <p className="text-sm text-slate-500">
            {debouncedSearch ? "Try a different search term." : "Get started by creating your first blog."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300"
            >
              <div className="aspect-video relative bg-slate-100 overflow-hidden">
                {blog.imageKey ? (
                  <Image
                    src={blog.imageKey}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FileText className="size-12 text-foreground" />
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight">
                    {blog.title}
                  </h3>
                  <span
                    className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      blog.isActive
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-slate-50 text-slate-600 border-slate-100"
                    }`}
                  >
                    {blog.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-medium mb-4 flex items-center gap-1">
                  /{blog.slug}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                  <Calendar className="size-3.5" />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                  <EditButton href={`/dashboard/blogs/${blog.id}/edit`} />
                  <DeleteButton
                    id={blog.id}
                    endpoint={API_ROUTES.BLOG}
                    queryKey="blogs"
                    entityName="blog"
                    onSuccess={revalidateBlogs}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}