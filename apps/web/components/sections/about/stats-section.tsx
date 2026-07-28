"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "100K+", label: "Developers", suffix: "and counting" },
  { value: "5K+", label: "GitHub Stars", suffix: "and growing" },
  { value: "50+", label: "Plugins", suffix: "available" },
  { value: "<50ms", label: "Cold Start", suffix: "avg response" },
];

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium text-slate-300">{stat.label}</div>
              <div className="mt-1 text-xs text-slate-500">{stat.suffix}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
