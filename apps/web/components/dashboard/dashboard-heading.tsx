"use client";

import Link from "next/link";
import { Plus, ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardHeadingProps {
  title: string;
  path?: string;
  description?: string;
  className?: string;
  buttonText?: string;
}

const DashboardHeading = ({
  title,
  path,
  description,
  className,
  buttonText = "Add New",
}: DashboardHeadingProps) => {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="space-y-1">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <Link href="/dashboard" className="hover:text-primarymain transition-colors flex items-center gap-1">
            <Home className="size-3" />
            Dashboard
          </Link>
          {path && (
            <>
              <ChevronRight className="size-3" />
              <span className="text-slate-500">{path}</span>
            </>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-0.5 mt-4">
          <h2 className="text-lg font-black text-primarymain capitalize">
            {title}
          </h2>
          {description && (
            <p className="text-xs font-medium text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      {path && (
        <div className="shrink-0">
          <Link href={`/dashboard/${path}/add`}>
            <button
              name="add-new-btn"
              className="bg-primarymain flex items-center gap-2 rounded-md px-4 py-2 text-xs text-white duration-200 ease-in-out hover:bg-secondarymain"
            >
              <Plus className="size-4" />
              <span>{buttonText}</span>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardHeading;
