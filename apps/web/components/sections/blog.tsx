import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/blog-card";
import { getBlogs } from "@/actions/blog-action";
import type { Blog as BlogType } from "@/types/blog";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import PrimaryButton from "../ui/primary-button";

export async function Blog() {
  const posts = await getBlogs({ take: 3, isActive: true });

  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Latest insights"
          subtitle="Blog"
          desc="Stay up to date with the latest news, articles, and resources from our team."
        />

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0,3).map((post: BlogType) => (
            <BlogCard
              key={post.id}
              blog={post}
            />
          ))}
        </div>

        <div className="mt-14 text-center">
            <PrimaryButton
                text="View All"
                path="/blog"
                variant="secondary"
              />
        </div>
      </div>
    </section>
  );
}
