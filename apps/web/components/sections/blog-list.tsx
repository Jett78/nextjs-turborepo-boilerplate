"use client";

import { motion } from "framer-motion";
import { BlogCard } from "@/components/blog-card";
import NoData from "@/components/no-data";
import type { Blog } from "@/types/blog";

export default function BlogList({ posts }: { posts: Blog[] }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <NoData title="blog posts" />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {posts[0] && <BlogCard blog={posts[0]} featured />}
            </motion.div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(1).map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <BlogCard blog={post} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
