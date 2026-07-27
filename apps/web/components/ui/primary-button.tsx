"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  path?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

const PrimaryButton: React.FC<Props> = ({
  text,
  path,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  variant = "primary",
}) => {
  const colorClasses = {
    primary: {
      circle: "bg-primarymain",
    },
    secondary: {
      circle: "bg-secondarymain",
    },
  };

  const colors = colorClasses[variant];

  const baseClasses = cn(
    "group relative font-medium text-sm  overflow-hidden overflow-x-hidden rounded-md bg-neutral-950 px-6 py-3 text-neutral-50",
    disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
    className
  );

  const content = (
    <>
      <span className="relative z-10">{text}</span>
      <span className="absolute inset-0 overflow-hidden rounded-md">
        <span
          className={cn(
            "absolute left-0 aspect-square w-full origin-center -translate-x-full rounded-full transition-all duration-500 group-hover:-translate-x-0 group-hover:scale-150",
            colors.circle
          )}
        ></span>
      </span>
    </>
  );

  if (path) {
    return (
      <Link href={path} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {content}
    </button>
  );
};

export default PrimaryButton;
