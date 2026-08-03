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
    <header className="fixed left-0 right-0 top-0 z-50 w-full bg-[#2D0D46]/95 shadow-sm">
      <div className="w-full px-4 sm:px-6 md:px-5 lg:px-8 xl:px-10">
        <div className="flex h-20 items-center md:h-24 lg:h-28 xl:h-32">
             {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <div className="relative w-45 h-17.5 md:w-55 md:h-15 2xl:w-65 2xl:h-25">
              <Image
                src="/images/logo_white.png"
                alt="Luxviajes Logo"
                fill
                className="object-contain object-left"
                loading="eager"
                priority
                sizes="(max-width: 768px) 180px, (max-width: 1535px) 220px, 320px"
              />
            </div>
          </Link>


          {/* Desktop Navigation */}
          <nav
            className="
              ml-4 hidden min-w-0 flex-1
              items-center justify-end
              gap-2
              md:flex
              lg:ml-8 lg:gap-4
              xl:ml-12 xl:gap-6
            "
          >
            {NAVIGATION_LINKS.map((link) => {
              const isActive = currentActiveLink === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    `
                      whitespace-nowrap
                      border-b-2 border-transparent
                      pb-1
                      text-[12px] font-medium
                      leading-none
                      transition-colors
                      lg:text-sm
                      xl:text-lg
                      2xl:text-xl
                    `,
                    isActive
                      ? "border-[#8A3BB7] font-black text-white"
                      : "text-[#CCC6D0] hover:text-purple-400",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="
              ml-auto rounded-lg p-2
              transition hover:bg-white/10
              md:hidden
            "
            aria-label={
              isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"
            }
            aria-expanded={isMobileMenuOpen}
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
          <nav className="border-t border-white/10 pb-4 pt-2 md:hidden">
            <div className="flex flex-col gap-3">
              {NAVIGATION_LINKS.map((link) => {
                const isActive = currentActiveLink === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      `
                        rounded-lg
                        px-4 py-2
                        font-medium
                        transition-colors
                      `,
                      isActive
                        ? "bg-[#500088] text-white"
                        : "text-[#CCC6D0] hover:bg-white/10 hover:text-white",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}