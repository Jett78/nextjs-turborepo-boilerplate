"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { containerVariants, itemVariantsY } from "@/lib/motion";

type Props = {
  img: string;
  title: string;
  path?: string;
};

const PageBanner = ({ img, title, path }: Props) => {
  return (
    <div className="relative">
      <Image
        src={img}
        alt="hero"
        width={1000}
        height={500}
        className="lg:h-[23em] md:h-[18em] h-[15em] w-full object-cover brightness-75"
        priority
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-blue-500 via-secondarymain/80 to-transparent opacity-70" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        viewport={{ once: true, amount: 0.2 }}
        className="absolute w-full left-1/2 top-2/3 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            variants={itemVariantsY}
            className="font-semibold lg:text-4xl md:text-3xl text-2xl text-white text-center"
          >
            {title}
          </motion.h2>
          {path && (
            <motion.div
              variants={itemVariantsY}
              className="flex justify-center md:mt-4 mt-2 gap-2 text-sm md:text-base text-white"
            >
              <Link href="/">
                <span>Home</span>
              </Link>{" "}
              /
              <Link href={`/${path}`}>
                <span className="text-white font-bold capitalize">{path}</span>
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PageBanner;
