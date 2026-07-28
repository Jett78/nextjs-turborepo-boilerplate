"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gray-950 px-8 py-20 text-center sm:px-16"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(99,102,241,0.15),transparent)]" />

          <div className="relative">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
              <Terminal className="h-7 w-7 text-white" />
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Start building today.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-400">
              One command. Zero configuration. A production-ready app in seconds.
            </p>

            <div className="mt-10 inline-flex items-center gap-3 rounded-xl bg-white/5 px-6 py-3 ring-1 ring-white/10 font-mono text-sm text-slate-300">
              <span className="text-emerald-400">$</span>
              <span>npx create-nextjs-app my-project</span>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 shadow-lg shadow-white/10 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                View on GitHub
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-white ring-1 ring-white/20 transition-all hover:bg-white/5"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
