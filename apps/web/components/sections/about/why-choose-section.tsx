"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

const reasons = [
  {
    title: "Opinionated Defaults",
    description: "We made the hard choices so you don't have to. Every tool, every pattern — deliberately chosen.",
  },
  {
    title: "Zero Config Deploy",
    description: "Push to GitHub, deploy to Vercel. CI/CD, environment variables, and preview deploys work out of the box.",
  },
  {
    title: "Type-Safe End-to-End",
    description: "Shared types between frontend and backend. Refactor with confidence across the entire stack.",
  },
  {
    title: "Production Ready",
    description: "Error handling, logging, rate limiting, CORS — the stuff you'd spend days setting up is already done.",
  },
  {
    title: "Modular by Design",
    description: "Remove what you don't need. Add what you do. Every piece is independent and replaceable.",
  },
  {
    title: "Community Driven",
    description: "Open source, actively maintained, and shaped by the developers who use it daily.",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-5 lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-2 lg:sticky lg:top-24"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 ring-1 ring-inset ring-indigo-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              Why Us
            </span>
            <h2 className="mt-6 text-2xl font-extrabold  text-gray-900 sm:text-4xl">
              Built by Developers,
              <span className="block text-primarymain">For Developers.</span>
            </h2>
            <p className="mt-6 text-base leading-7 text-gray-600">
              We&apos;ve been where you are — staring at a blank project, configuring
              the same tools for the hundredth time. That&apos;s exactly why this exists.
            </p>
          </motion.div>

          <div className="lg:col-span-3 space-y-4">
            {reasons.map((reason, i) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                viewport={{ once: true }}
                className="group relative rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 ring-1 ring-inset ring-indigo-500/20 transition-colors group-hover:bg-indigo-100">
                    <Check className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{reason.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
