"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditButtonProps {
  href: string;
  label?: string;
}

export function EditButton({ href, label = "Edit" }: EditButtonProps) {
  return (
    <Link href={href}>
      <Button
        variant="outline"
        size="sm"
        className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white border-0"
      >
        <Pencil className="size-3 mr-1" />
        {label}
      </Button>
    </Link>
  );
}
