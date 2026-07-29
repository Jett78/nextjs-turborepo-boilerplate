"use client";

import { motion } from "framer-motion";
import { BlogCard } from "@/components/blog-card";
import PrimaryButton from "../ui/primary-button";
import type { Blog as BlogType } from "@/types/blog";
import PageHeader from "../ui/page-header";

export default function BlogSection({ posts }: { posts: BlogType[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Latest Insights"
          subtitle="Blogs"
          desc="Explore our blog for valuable information and expert perspectives."
        />
        <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post: BlogType, i: number) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <BlogCard blog={post} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <PrimaryButton
            text="View All Posts"
            path="/blog"
            variant="secondary"
          />
        </motion.div>
      </div>
    </section>
  );
}
