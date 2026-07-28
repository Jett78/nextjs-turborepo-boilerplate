"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CompanyProfile } from "@/types/company-profile";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface NavbarClientProps {
  company: CompanyProfile | null;
}

export function NavbarClient({ company }: NavbarClientProps) {
  const pathname = usePathname();
  const [showNavbar, setShowNavbar] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (isOpen) return;
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isOpen]);

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out",
          showNavbar ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              {company?.logoKey ? (
                <Image
                  src={company.logoKey}
                  alt={company.companyName || "Logo"}
                  width={70}
                  height={70}
                  className="object-contain"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-secondarymain to-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-500/20">
                  Logo
                </div>
              )}
            </Link>

            {/* Mobile logo text */}
            <span className="text-sm font-extrabold tracking-tight text-gray-900 sm:hidden">
              {company?.companyName || "Linkstar Manpower"}
            </span>

            {/* Right section */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Desktop nav */}
              <nav className="hidden items-center gap-2 md:flex">
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={cn(
                        "relative rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200",
                        isActive
                          ? "text-secondarymain"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                      )}
                    >
                      {item.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-secondarymain" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* WhatsApp button */}
              {company?.whatsappNumber && (
                <Link
                  href={`https://wa.me/${company.whatsappNumber}`}
                  target="_blank"
                  className="hidden items-center gap-2 rounded-full bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-white  transition-all duration-300 hover:bg-emerald-600 hover:shadow-sm  hover:shadow-emerald-500/30 hover:scale-105 sm:inline-flex"
                >
                  <WhatsAppIcon className="h-6 w-6" />
                  <span className="lg:inline">WhatsApp Us</span>
                </Link>
              )}

              {/* Hamburger */}
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 md:hidden"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
            <span className="text-lg font-bold text-gray-900">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "flex items-center rounded-xl px-4 py-3 text-base font-medium transition-all duration-200",
                      isActive
                        ? "bg-secondarymain/10 text-secondarymain"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* WhatsApp CTA */}
          {company?.whatsappNumber && (
            <div className="border-t border-gray-100 p-4">
              <Link
                href={`https://wa.me/${company.whatsappNumber}`}
                target="_blank"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:bg-emerald-600 hover:shadow-xl"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Chat on WhatsApp
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
