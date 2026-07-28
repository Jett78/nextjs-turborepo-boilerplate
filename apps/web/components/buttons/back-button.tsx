"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      Go back
    </button>
  );
};

export default BackButton;
