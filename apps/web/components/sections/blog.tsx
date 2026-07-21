import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";

const posts = [
  {
    title: "Building Scalable APIs with Modern Architecture",
    description:
      "Learn how to design and implement APIs that can handle millions of requests while maintaining clean code and developer experience.",
    date: "Mar 15, 2026",
    readTime: "8 min read",
    category: "Engineering",
    href: "#",
  },
  {
    title: "The Future of Web Development in 2026",
    description:
      "Explore the emerging trends, tools, and techniques that are shaping the future of how we build for the web.",
    date: "Mar 12, 2026",
    readTime: "6 min read",
    category: "Trends",
    href: "#",
  },
  {
    title: "Mastering Design Systems at Scale",
    description:
      "A practical guide to creating and maintaining design systems that grow with your product and team.",
    date: "Mar 8, 2026",
    readTime: "10 min read",
    category: "Design",
    href: "#",
  },
];

export function Blog() {
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
          {posts.map((post) => (
            <Link key={post.title} href={post.href} className="group">
              <Card className="h-full transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{post.category}</Badge>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <CardTitle className="mt-4 line-clint-2 text-lg leading-snug">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{post.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="#"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            View all posts
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
