"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { UserForm } from "@/components/dashboard/user-form";

export default function AddUserPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/users"
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="size-5 text-slate-600" />
        </Link>
        <div>
          <h2 className="text-lg font-black tracking-tight text-primarymain">Add New User</h2>
          <p className="text-slate-500 mt-1 text-xs">
            Create a new user account with their role and credentials.
          </p>
        </div>
      </div>

      <UserForm />
    </div>
  );
}
