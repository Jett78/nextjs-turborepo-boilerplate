import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { getBlogBySlug, getAllBlogSlugs } from "@/actions/blog-action";
import type { Metadata } from "next";
import type { BlogPostPageProps } from "@/types/components";

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
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">{formatDate(blog.createdAt)}</Badge>
              {blog.seoMeta?.metaKeywords?.map((keyword) => (
                <Badge key={keyword} variant="outline">
                  {keyword}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {blog.title}
            </h1>
            {blog.description && (
              <p className="mt-4 text-xl text-muted-foreground">
                {blog.description}
              </p>
            )}
          </div>

          {imageUrl && (
            <div className="mb-10 overflow-hidden rounded-2xl">
              <img
                src={imageUrl}
                alt={blog.title}
                className="w-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg prose-zinc dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {blog.description || "No content available."}
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
