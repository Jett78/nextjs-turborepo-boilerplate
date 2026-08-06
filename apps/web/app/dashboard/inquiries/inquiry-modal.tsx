"use client";

import { useEffect } from "react";
import { X, Mail, Phone, Calendar, MessageSquare } from "lucide-react";
import type { Inquiry } from "@/types/inquiry";

interface InquiryModalProps {
  inquiry: Inquiry | null;
  onClose: () => void;
}

export default function InquiryModal({ inquiry, onClose }: InquiryModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (inquiry) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [inquiry]);

  if (!inquiry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Inquiry Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="size-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#4f46e5]/80 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {inquiry.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{inquiry.name}</p>
              <p className="text-sm text-slate-500">Contact Person</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="size-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Mail className="size-5 text-[#4f46e5]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Email</p>
                <p className="text-sm font-semibold text-slate-900">{inquiry.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="size-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Phone className="size-5 text-[#4f46e5]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Phone</p>
                <p className="text-sm font-semibold text-slate-900">{inquiry.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="size-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Calendar className="size-5 text-[#4f46e5]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Date</p>
                <p className="text-sm font-semibold text-slate-900">
                  {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
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

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-700">
              <MessageSquare className="size-4" />
              <span className="text-sm font-semibold">Message</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {inquiry.message}
              </p>
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
