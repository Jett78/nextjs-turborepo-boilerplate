"use client";

import { motion } from "framer-motion";
import { BlogCard } from "@/components/blog-card";
import { BookOpen } from "lucide-react";
import PrimaryButton from "../ui/primary-button";
import type { Blog as BlogType } from "@/types/blog";

export default function BlogSection({ posts }: { posts: BlogType[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 ring-1 ring-inset ring-indigo-500/20">
            <BookOpen className="h-3.5 w-3.5" />
            Blog
          </span>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Latest insights
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Stay up to date with the latest news, articles, and resources from our team.
          </p>
        </motion.div>

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
          <PrimaryButton text="View All Posts" path="/blog" variant="secondary" />
        </motion.div>
      </div>
    </section>
  );
}
