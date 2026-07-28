import { Blog } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getImageSrc(path: string): string {
  if (path.startsWith("/") || path.startsWith("http")) return path;
  return `/${path}`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function FeaturedCard({ blog }: { blog: Blog }) {
  const imageUrl = getImageSrc(blog.imageKey || "/images/blog-placeholder.png");

  return (
    <Link href={`/blog/${blog.slug}`} className="group block">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center rounded-3xl bg-white ring-1 ring-gray-900/5 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:shadow-gray-200/50">
        <div className="relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={blog.title}
            width={800}
            height={500}
            className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-80 lg:h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="p-8 sm:p-10 lg:py-12 lg:px-10">
          <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
            <time dateTime={new Date(blog.createdAt).toISOString()}>
              {formatDate(blog.createdAt)}
            </time>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-indigo-600 ring-1 ring-inset ring-indigo-500/20">
              Featured
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl group-hover:text-indigo-600 transition-colors">
            {blog.title}
          </h2>

          {blog.description && (
            <p className="mt-4 text-sm leading-relaxed text-gray-500 line-clamp-3">
              {stripHtml(blog.description)}
            </p>
          )}

          <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            Read article
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function DefaultCard({ blog }: { blog: Blog }) {
  const imageUrl = getImageSrc(blog.imageKey || "/images/blog-placeholder.png");

  return (
    <Link href={`/blog/${blog.slug}`} className="group block">
      <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-gray-900/5 shadow-sm transition-all hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5">
        <div className="relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={blog.title}
            width={600}
            height={400}
            className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <time
            dateTime={new Date(blog.createdAt).toISOString()}
            className="text-xs font-medium text-gray-400"
          >
            {formatDate(blog.createdAt)}
          </time>

          <h3 className="mt-3 text-lg font-semibold leading-snug text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {blog.title}
          </h3>

          {blog.description && (
            <p className="mt-2.5 text-sm leading-relaxed text-gray-500 line-clamp-2">
              {stripHtml(blog.description)}
            </p>
          )}

          <div className="mt-auto pt-6">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              Read more
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

const BlogCard = ({
  blog,
  featured = false,
}: {
  blog: Blog;
  featured?: boolean;
}) => {
  if (featured) {
    return <FeaturedCard blog={blog} />;
  }
  return <DefaultCard blog={blog} />;
};

export { BlogCard };
export default BlogCard;
