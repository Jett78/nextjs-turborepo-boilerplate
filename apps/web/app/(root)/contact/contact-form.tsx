"use client";

import { useState } from "react";
import { createInquiry } from "@/actions/inquiry-action";
import PrimaryButton from "@/components/ui/primary-button";
import { CheckCircle, XCircle } from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      await createInquiry(formData);
      setStatus({ type: "success", message: "Thank you! Your inquiry has been submitted." });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status && (
        <div
          className={`flex items-center gap-2 p-4 rounded-xl text-sm ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 flex-shrink-0" />
          )}
          {status.message}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full outline-none px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 text-sm transition-all duration-200 placeholder:text-gray-400"
            placeholder="John Doe"
            required
            maxLength={30}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full outline-none px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 text-sm transition-all duration-200 placeholder:text-gray-400"
            placeholder="john@example.com"
            required
            maxLength={50}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">
          Contact Number <span className="text-red-500">*</span>
        </label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full outline-none px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 text-sm transition-all duration-200 placeholder:text-gray-400"
          placeholder="9812345678"
          required
          maxLength={10}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          placeholder="Tell us about your requirements or questions..."
          className="w-full outline-none px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 text-sm transition-all duration-200 resize-none placeholder:text-gray-400"
          required
          maxLength={500}
        />
        <p className="text-xs text-gray-400 text-right">
          {formData.message.length}/500 characters
        </p>
      </div>

      <PrimaryButton
        text={isSubmitting ? "Sending..." : "Send Message"}
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto flex items-center justify-center gap-2"
      />
    </form>
  );
};

export default ContactForm;
