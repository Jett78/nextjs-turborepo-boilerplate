"use client";

import { motion } from "framer-motion";
import { Layers, Lock, Database, Zap, Code2, Globe } from "lucide-react";
import PageHeader from "@/components/ui/page-header";

const features = [
  {
    icon: Layers,
    title: "Monorepo Architecture",
    description:
      "Turborepo-powered workspace with shared packages. Write once, use everywhere — types, utilities, UI components.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Lock,
    title: "Authentication",
    description:
      "Secure, session-based auth with Better Auth. Social logins, email verification, and role-based access built in.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Database,
    title: "Database Layer",
    description:
      "Prisma ORM with PostgreSQL. Type-safe queries, automated migrations, and seed scripts ready to go.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Zap,
    title: "API Backend",
    description:
      "NestJS REST API with modular architecture. Guards, interceptors, DTOs, and Swagger docs out of the box.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Code2,
    title: "Full Type Safety",
    description:
      "TypeScript end-to-end with shared types between client and server. Catch bugs before they happen.",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: Globe,
    title: "SEO & Performance",
    description:
      "Metadata API, Open Graph, sitemaps, structured data. Core Web Vitals optimized from day one.",
    color: "from-sky-500 to-blue-600",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <PageHeader
            subtitle="Features"
            title="Everything you need. Nothing you don't."
            desc="Batteries-included without the bloat. Every tool is chosen for a reason, and every default is intentional."
          />
        </motion.div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
                className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5"
              >
                <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg shadow-gray-200`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-gray-500">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
