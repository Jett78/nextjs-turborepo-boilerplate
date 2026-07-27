import React from "react";
import { cn } from "@/lib/utils";

type titleprops = {
  title: string;
  subtitle?: string;
  desc?: string;
  className?: string;
};

const PageHeader = ({ title, subtitle, desc, className }: titleprops) => {
  return (
    <div className="flex flex-col space-y-1 items-center justify-center">
      <p className="tracking-wider text-lighttext uppercase text-base font-bold">{subtitle}</p>
      <h2
        className={cn(
          className,
          "font-extrabold tracking-wide md:text-2xl text-xl text-center uppercase "
        )}
      >
        {title}
      </h2>
      {desc && (
        <p className="tracking-wide text-sm text-center text-muted-foreground font-medium text-lighttext">{desc}</p>
      )}
    </div>
  );
};

export default PageHeader;
