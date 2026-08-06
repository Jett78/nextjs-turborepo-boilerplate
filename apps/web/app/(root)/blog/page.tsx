import { getPageSeoForMetadata } from "@/actions/page-seo-action";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { getBlogs } from "@/actions/blog-action";
import BlogList from "@/components/sections/blog-list";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeoForMetadata("/blog");

  return {
    title: seo?.metaTitle ?? "Blog",
    description: seo?.metaDescription ?? "",
    openGraph: {
      title: seo?.ogTitle ?? seo?.metaTitle ?? "Blog",
      description: seo?.ogDescription ?? seo?.metaDescription ?? "",
      images: seo?.ogImageKey ? [{ url: seo.ogImageKey }] : [],
    },
  };
}

export default async function BlogPage() {
  const posts = await getBlogs({ take: 50, isActive: true });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gray-950 py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 ring-1 ring-inset ring-white/10">
              <BookOpen className="h-3.5 w-3.5" />
              Blog
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Ideas, insights,
              <span className="block text-slate-400">and inspiration.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              Thoughts on development, design, and building products that matter.
            </p>
          </div>
        </div>
      </section>

      <BlogList posts={posts} />
    </div>
  );
}
