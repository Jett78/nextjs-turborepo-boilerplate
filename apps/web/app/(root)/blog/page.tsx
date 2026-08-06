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
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-600/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
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
