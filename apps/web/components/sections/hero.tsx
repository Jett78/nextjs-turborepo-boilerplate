"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import PrimaryButton from "@/components/ui/primary-button";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};


export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-linear-to-br from-gray-50 via-white to-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl">
          {/* Left content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="text-center"
          >
            {/* Badge */}
            <motion.div variants={item}>
              <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-3 w-3 text-primary" />
                </span>
                Introducing Turborepo v3
                <ArrowRight className="h-4 w-4" />
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={item}
              className="text-3xl font-extrabold tracking-tight leading-[1.2] text-gray-800 sm:text-3xl lg:text-4xl xl:text-5xl"
            >
              Build your <span className="text-primarymain">Nextjs</span> App
              <br />
              faster than ever
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={item}
              className="mx-auto mt-6 max-w-2xl leading-relaxed text-gray-600"
            >
              A production-grade Next.js boilerplate with TypeScript, Tailwind
              CSS, and Turborepo. Everything you need to ship a full-stack app
              in minutes.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={item}
              className="mt-10 flex items-center  justify-center"
            >
              <PrimaryButton
                text="Get Started Free"
                path="/dashboard"
                variant="secondary"
              />
            
            </motion.div>

            {/* Trust indicators */}
            <motion.div variants={item} className="mt-10">
              <div className="flex items-center justify-center gap-4">
                {/* Avatars */}
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-white"
                      style={{
                        background: `hsl(${i * 60}, 70%, 60%)`,
                      }}
                    />
                  ))}
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  4.9/5 from 500+ reviews
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                Trusted by 5,000+ developers worldwide. Full type safety out of
                the box.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
