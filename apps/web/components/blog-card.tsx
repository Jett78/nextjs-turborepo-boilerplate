import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import type { Blog } from "@/types/blog";

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getExcerpt(text: string, maxLength: number = 120): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

interface BlogCardProps {
  blog: Blog;
  variant?: "default" | "featured";
}

export function BlogCard({ blog, variant = "default" }: BlogCardProps) {
  const imageUrl = blog.imageKey || blog.seoMeta?.ogImageKey;

  if (variant === "featured") {
    return (
      <Link href={`/blog/${blog.slug}`} className="group block">
        <article className="relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:bg-zinc-900">
          <div className="aspect-[16/9] overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={blog.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                <span className="text-6xl font-bold text-white/20">
                  {blog.title.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="mb-3 flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                {formatDate(blog.createdAt)}
              </Badge>
              {blog.seoMeta?.metaKeywords?.[0] && (
                <Badge variant="outline" className="text-xs">
                  {blog.seoMeta.metaKeywords[0]}
                </Badge>
              )}
            </div>
            <h3 className="mb-2 text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {blog.title}
            </h3>
            {blog.description && (
              <p className="text-muted-foreground line-clamp-2">
                {getExcerpt(blog.description, 150)}
              </p>
            )}
            <div className="mt-4 inline-flex items-center text-sm font-medium text-primary">
              Read more
              <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${blog.slug}`} className="group block">
      <article className="relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:bg-zinc-900">
        <div className="aspect-[16/10] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="text-5xl font-bold text-primary/20">
                {blog.title.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {formatDate(blog.createdAt)}
            </Badge>
          </div>
          <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground line-clamp-2 transition-colors group-hover:text-primary">
            {blog.title}
          </h3>
          {blog.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {getExcerpt(blog.description)}
            </p>
          )}
          <div className="mt-4 flex items-center text-sm font-medium text-primary">
            Read more
            <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </article>
    </Link>
  );
}
