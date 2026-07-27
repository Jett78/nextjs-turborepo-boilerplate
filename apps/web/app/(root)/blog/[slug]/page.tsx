import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getBlogBySlug, getAllBlogSlugs } from "@/actions/blog-action";
import BackButton from "@/components/buttons/back-button";
import SocialShare from "@/components/buttons/social-share-button";
import type { Metadata } from "next";
import type { BlogPostPageProps } from "@/types/components";
import Image from "next/image";

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return { title: "Blog Not Found" };
  }

  const metaTitle = blog.seoMeta?.metaTitle || blog.title;
  const metaDescription =
    blog.seoMeta?.metaDescription || blog.description || "";
  const ogImage = blog.seoMeta?.ogImageKey || blog.imageKey;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: blog.seoMeta?.ogTitle || metaTitle,
      description: blog.seoMeta?.ogDescription || metaDescription,
      images: ogImage ? [{ url: ogImage }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.seoMeta?.ogTitle || metaTitle,
      description: blog.seoMeta?.ogDescription || metaDescription,
      images: ogImage ? [ogImage] : [],
    },
    robots: blog.seoMeta?.metaRobots || "index, follow",
    alternates: blog.seoMeta?.canonicalUrl
      ? { canonical: blog.seoMeta.canonicalUrl }
      : undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const imageUrl = blog.imageKey || blog.seoMeta?.ogImageKey;

  return (
    <article className="mx-4 my-28 max-w-5xl space-y-4 md:my-32 md:space-y-8 xl:mx-auto">
      <BackButton />

      <header className="space-y-6 border-b border-zinc-200 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold text-zinc-900 md:text-3xl">
            {blog.title}
          </h1>

          <SocialShare slug={blog.slug} title={blog.title} />
        </div>

        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <span>{formatDate(blog.createdAt)}</span>
        </div>
      </header>

      {imageUrl && (
        <figure className="relative my-10 overflow-hidden rounded-2xl shadow-lg">
          <Image
            src={imageUrl}
            alt={blog.title}
            className="h-[20em] w-full object-cover md:h-[26em]"
            height={1000}
            width={1000}
          />
        </figure>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div
          className="space-y-6 text-sm leading-[1.9]  font-medium text-lighttext sm:text-base"
          dangerouslySetInnerHTML={{ __html: blog.description || "No content available." }}
        />
      </div>

      {/* Footer */}
      <footer className="mt-16 flex items-center justify-between border-t border-zinc-200 pt-8">
        <p className="text-sm text-zinc-500">
          Written by <span className="font-medium text-zinc-700">Admin</span>
        </p>

        <SocialShare slug={blog.slug} title={blog.title} />
      </footer>
    </article>
  );
}
