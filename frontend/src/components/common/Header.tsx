"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAVIGATION_LINKS, COMPANY_INFO } from "@/constants";
import { cn } from "@/utils/cn";
import { Button } from "./Button";

interface HeaderProps {
  activeLink?: string;
}

export function Header({ activeLink }: HeaderProps) {
  const pathname = usePathname();
  const currentActiveLink = activeLink || pathname;
  return (
    <header className="absolute top-0 left-0 right-0 w-full z-100 bg-primary/70 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-40">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo_white.png"
              alt="Lux Viajes Logo"
              width={320}
              height={125}
<<<<<<< HEAD
              className="h-auto"
              style={{ maxHeight: "125px", width: "auto" }}
=======
              className="h-[125px] w-auto"
>>>>>>> 5937c20fc6610c517c07f75b844d9161a92d4daf
              loading="eager"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-6">
            {NAVIGATION_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-medium transition-colors",
                  currentActiveLink === link.href
                    ? "text-white text-lg font-black border-b-2 border-[#500088]"
                    : "text-[#CCC6D0] text-lg   hover:text-purple-600",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
