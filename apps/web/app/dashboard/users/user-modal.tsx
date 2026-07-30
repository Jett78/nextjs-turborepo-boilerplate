"use client";

import { useEffect } from "react";
import { X, Mail, Phone, Calendar, Shield, UserCheck, UserX, Users } from "lucide-react";
import type { User } from "@/types/user";
import Image from "next/image";

interface UserModalProps {
  user: User | null;
  onClose: () => void;
}

const getRoleBadge = (role: string) => {
  const roleStyles: Record<string, string> = {
    super_admin: "bg-rose-50 text-rose-700 border-rose-200",
    admin: "bg-purple-50 text-purple-700 border-purple-200",
    manager: "bg-blue-50 text-blue-700 border-blue-200",
    customer: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return roleStyles[role] || "bg-slate-50 text-slate-700 border-slate-200";
};

export default function UserModal({ user, onClose }: UserModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (user) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [user]);

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">User Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="size-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  height={500}
                  width={500}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users className="size-6 text-slate-400" />
              )}
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">{user.name}</h4>
              <p className="text-sm text-slate-500">User Account</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="size-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Mail className="size-5 text-[#4f46e5]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Email</p>
                <p className="text-sm font-semibold text-slate-900">{user.email}</p>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="size-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Phone className="size-5 text-[#4f46e5]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Phone</p>
                  <p className="text-sm font-semibold text-slate-900">{user.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="size-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Shield className="size-5 text-[#4f46e5]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Role</p>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleBadge(
                    user.role
                  )}`}
                >
                  {user.role.replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="size-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                {user.emailVerified ? (
                  <UserCheck className="size-5 text-emerald-500" />
                ) : (
                  <UserX className="size-5 text-slate-400" />
                )}
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Email Status</p>
                <p className={`text-sm font-semibold ${user.emailVerified ? "text-emerald-700" : "text-slate-500"}`}>
                  {user.emailVerified ? "Verified" : "Not Verified"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="size-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Calendar className="size-5 text-[#4f46e5]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Joined</p>
                <p className="text-sm font-semibold text-slate-900">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}