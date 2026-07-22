import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/blog-card";
import { getBlogs } from "@/actions/blog-action";
import type { Blog as BlogType } from "@/types/blog";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function Blog() {
  const posts = await getBlogs({ take: 3, isActive: true });

  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            Blog
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Latest insights
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Deep dives into engineering, design, and the future of building
            products.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: BlogType, index: number) => (
            <BlogCard
              key={post.id}
              blog={post}
              variant={index === 0 ? "featured" : "default"}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View all posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
