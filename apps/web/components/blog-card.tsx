import { Blog } from "@/types/blog";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getImageSrc(path: string): string {
  if (path.startsWith("/") || path.startsWith("http")) return path;
  return `/${path}`;
}

const BlogCard = ({ blog }: { blog: Blog }) => {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <div className="relative  group overflow-hidden">
        <figure className="rounded-md overflow-hidden">
          <Image
            src={getImageSrc(blog.imageKey || "/images/blog-placeholder.png")}
            alt="blog"
            width={400}
            height={400}
            loading="lazy"
            className="w-full md:h-[25em] sm:h-[22em] h-[17em] object-cover group-hover:scale-110 ease-in-out duration-300 brightness-75 group-hover:brightness-100"
          />
        </figure>

        <div className="absolute pointer-events-none inset-0 z-0 h-full w-full rounded-md bg-linear-to-t from-black via-black/50 to-transparent" />

        <div className="absolute group-hover:bottom-6 -bottom-10 ease-in-out duration-300 mx-2 left-4 space-y-2">
          <p className="text-white/80 text-sm  ">
            {formatDate(blog.createdAt)}
          </p>
          <h3 className="text-white font-semibold text-lg line-clamp-1">
            {blog.title}
          </h3>
          <p
            className="text-white text-sm leading-6 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />

          <button
            name="read-more-btn"
            className="mt-6 flex  items-center rounded-full text-white text-xs px-4 py-2 bg-secondarymain hover:bg-secondarymain/90 duration-300 ease-in-out"
          >
            Read More
            <Icon icon="ei:arrow-right" width="24" height="24" />{" "}
          </button>
        </div>
      </div>
    </Link>
  );
};

export { BlogCard };
export default BlogCard;
