"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

interface ContactInfoProps {
  companyInfo: {
    companyName?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    whatsappNumber?: string;
    [key: string]: unknown;
  } | null;
}

const ContactInfo = ({ companyInfo }: ContactInfoProps) => {
  const phoneNumber = companyInfo?.phoneNumber || "+977-9800000000";
  const email = companyInfo?.email || "info@nextjs.com";
  const address = companyInfo?.address || "Kathmandu, Nepal";
  const whatsappNumber = companyInfo?.whatsappNumber || "+977-9800000000";

  const item = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      desc: phoneNumber,
      href: `tel:${phoneNumber.replace(/[^0-9+]/g, "")}`,
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      desc: email,
      href: `mailto:${email}`,
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Us",
      desc: address,
      href: null,
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "WhatsApp",
      desc: whatsappNumber,
      href: `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`,
    },
  ];

  return (
    <div className="text-white">
      <h4 className="font-bold text-xl mb-2">Contact Information</h4>
      <p className="text-white/90 text-sm mb-8">
        Get in touch with us through any of these channels
      </p>

      <div className="space-y-5 mb-10">
        {item.map((info, index) => {
          const content = (
            <div className="flex gap-4 items-start group hover:translate-x-1 transition-transform duration-200">
              <span className="flex justify-center items-center h-14 w-14 bg-white/20 backdrop-blur-sm rounded-xl text-white group-hover:bg-white/30 transition-colors duration-200 flex-shrink-0">
                {info.icon}
              </span>

              <div className="flex-1">
                <h5 className="font-semibold text-base text-white mb-1">
                  {info.title}
                </h5>
                <p className="text-white/90 text-sm whitespace-pre-wrap leading-relaxed">
                  {info.desc}
                </p>
              </div>
            </div>
          );

          if (info.href) {
            return (
              <Link
                key={index}
                href={info.href}
                target={info.href.startsWith("http") ? "_blank" : undefined}
                rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="block"
              >
                {content}
              </Link>
            );
          }

          return (
            <div key={index}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactInfo;
