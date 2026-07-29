"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface FormFieldProps<
  T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
> extends React.InputHTMLAttributes<T> {
  label: string;
  errors?: string;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
  icon?: LucideIcon;
  suffix?: React.ReactNode;
}

function FormField<
  T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement =
    HTMLInputElement,
>({
  label,
  errors,
  textarea = false,
  rows = 4,
  placeholder,
  icon: Icon,
  suffix,
  className,
  ...props
}: FormFieldProps<T>) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold text-slate-700 ">{label}</Label>
      {textarea ? (
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-3 size-4 text-slate-400" />
          )}
          <textarea
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            placeholder={placeholder}
            rows={rows}
            className={cn(
              "w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition-colors",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
              "placeholder:text-slate-400",
              Icon && "pl-10",
              errors && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
              className
            )}
          />
        </div>
      ) : (
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          )}
          <Input
            placeholder={placeholder}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            className={cn(
              "w-full rounded-lg border border-slate-200 bg-white text-sm outline-none transition-colors h-11 mt-2",
              " ",
              "placeholder:text-slate-400",
              Icon && "pl-10",
              suffix && "pr-10",
              errors && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
              className
            )}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {suffix}
            </div>
          )}
        </div>
      )}
      {errors && <p className="text-xs font-medium text-rose-500">{errors}</p>}
    </div>
  );
}

export default FormField;
