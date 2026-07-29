"use client";

import { motion } from "framer-motion";
import { Code2, ArrowRight } from "lucide-react";

export default function StorySection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 ring-1 ring-inset ring-indigo-500/20">
              <Code2 className="h-3.5 w-3.5" />
              Our Story
            </span>

            <h2 className="mt-8 text-4xl font-extrabold  text-gray-900 sm:text-5xl">
              We build tools
              <span className="block text-primarymain">Developers love.</span>
            </h2>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-gray-600">
              <p>
                Born out of frustration with repetitive boilerplate setup, Next.js Boilerplate
                started as an internal tool. We were tired of spending weeks on authentication,
                database schemas, and deployment configs before writing a single feature.
              </p>
              <p>
                So we built the template we always wished existed — opinionated enough to
                make decisions for you, flexible enough to get out of your way.
              </p>
              <p>
                Today, it powers hundreds of production apps worldwide, from side projects
                to enterprise dashboards.
              </p>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition-colors hover:text-indigo-600"
              >
                View source on GitHub
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl bg-gray-950 p-8 shadow-2xl ring-1 ring-white/10">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs text-slate-500 font-mono">terminal</span>
              </div>
              <pre className="font-mono text-sm leading-relaxed text-slate-300 overflow-x-auto">
                <code>
                  <span className="text-slate-500">$</span> <span className="text-emerald-400">npx</span> create-nextjs-app my-project{"\n"}
                  <span className="text-slate-500">$</span> <span className="text-emerald-400">cd</span> my-project{"\n"}
                  <span className="text-slate-500">$</span> <span className="text-emerald-400">pnpm</span> dev{"\n"}
                  {"\n"}
                  <span className="text-slate-500">  ➜</span> <span className="text-white">Ready</span> in <span className="text-yellow-400">1.2s</span>{"\n"}
                  <span className="text-slate-500">  ➜</span> Network: <span className="text-blue-400">http://localhost:3000</span>
                </code>
              </pre>
            </div>

            <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/20 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
