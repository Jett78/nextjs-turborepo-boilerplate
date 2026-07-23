"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps<
  T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
> extends React.InputHTMLAttributes<T> {
  label: string;
  errors?: string;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
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
  className,
  ...props
}: FormFieldProps<T>) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-bold text-slate-700">{label}</Label>
      {textarea ? (
        <textarea
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          placeholder={placeholder}
          rows={rows}
          className={cn(
            "w-full rounded-md border border-slate-200 bg-white p-3 text-xs outline-none transition-colors",
            "focus:border-primary focus:ring-1 focus:ring-primary/20",
            "placeholder:text-slate-400",
            errors && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
            className
          )}
        />
      ) : (
        <Input
          placeholder={placeholder}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          className={cn(
            "w-full rounded-md border border-slate-200 bg-white px-3 py-5 text-xs! outline-none transition-colors",
            "focus:border-primary focus:ring-1 focus:ring-primary/20",
            "placeholder:text-slate-400",
            errors && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
            className
          )}
        />
      )}
      {errors && <p className="text-xs font-medium text-rose-500">{errors}</p>}
    </div>
  );
}

export default FormField;
