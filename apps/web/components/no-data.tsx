import { FolderOpen } from "lucide-react";

type Props = {
  title?: string;
};

const NoData = ({ title }: Props) => {
  const formattedTitle = title
    ? title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
    : "Data";

  return (
    <div className="flex min-h-75 md:min-h-100 w-full flex-col items-center justify-center text-center p-8 rounded-3xl border border-zinc-100 bg-white backdrop-blur-md shadow-xs max-w-md mx-auto my-6">
      {/* Decorative Blur Background & Icon */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl scale-125 animate-pulse" />
        <div className="relative w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-zinc-100 shadow-md group transition-all duration-300 hover:scale-105">
          <FolderOpen className="text-zinc-400 group-hover:text-primary w-10 h-10 transition-colors duration-300" />
        </div>
      </div>

      {/* Title & Subtext */}
      <div className="space-y-2 max-w-xs">
        <h3 className="text-lg font-black text-gray-900 tracking-tight">
          No {formattedTitle} Found
        </h3>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">
          There&apos;s nothing to show here right now. Once {title || "data"} is
          added, it will appear here automatically.
        </p>
      </div>
    </div>
  );
};

export default NoData;
