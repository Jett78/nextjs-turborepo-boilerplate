import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getBlogs } from "@/actions/blog-action";
import type { Blog as BlogType } from "@/types/blog";

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function Blog() {
  const posts = await getBlogs({ take: 3, isActive: true });

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

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: BlogType) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <Card className="h-full transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Blog</Badge>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <CardTitle className="mt-4 line-clamp-2 text-lg leading-snug">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {post.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.description}
                    </p>
                  )}
                  <div className="mt-4 text-xs text-muted-foreground">
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {posts.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              View all posts
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
