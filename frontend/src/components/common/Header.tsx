"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { NAVIGATION_LINKS } from "@/constants";
import { cn } from "@/utils/cn";

interface HeaderProps {
  activeLink?: string;
}

export function Header({ activeLink }: HeaderProps) {
  const pathname = usePathname();
  const currentActiveLink = activeLink || pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#2D0D46]/95 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-32">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-45 h-17.5 md:w-55 md:h-15 lg:w-65 lg:h-25">
              <Image
                src="/images/logo_white.png"
                alt="Lux Viajes Logo"
                fill
                className="object-contain"
                loading="eager"
                priority
                sizes="(max-width: 768px) 180px, (max-width: 1024px) 260px, 320px"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            {NAVIGATION_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-medium transition-colors",
                  currentActiveLink === link.href
                    ? "text-white text-sm md:text-md lg:text-lg xl:text-xl font-black border-b-2 border-[#500088]"
                    : "text-[#CCC6D0] text-sm md:text-md lg:text-lg xl:text-xl hover:text-purple-600",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-white" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pb-4 pt-2 border-t border-white/10">
            <div className="flex flex-col gap-3">
              {NAVIGATION_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors",
                    currentActiveLink === link.href
                      ? "text-white bg-[#500088]"
                      : "text-[#CCC6D0] hover:bg-white/10 hover:text-white",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
