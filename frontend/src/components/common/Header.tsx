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
    <header className="absolute top-0 left-0 right-0 w-full z-[100] bg-primary/70 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-40">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo_white.png"
              alt="Lux Viajes Logo"
              width={320}
              height={125}
              className="h-[125px] w-auto"
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

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-green-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-.52.262-.994.618-1.38 1.062V3.051h-2.68v18.334h2.777v-8.667c0-.992.197-1.952.566-2.864.369-.912.972-1.694 1.756-2.231.784-.537 1.717-.812 2.685-.812 1.925 0 3.597 1.37 4.206 3.214.3.904.456 1.864.456 2.851v5.508h2.777v-5.508c0-1.024-.134-2.023-.4-2.984-.267-.96-.726-1.846-1.345-2.603-.62-.757-1.397-1.368-2.292-1.801-.895-.433-1.884-.65-2.89-.65z" />
              </svg>
            </a>
            <Button size="sm" className="hidden sm:inline-flex">
              {COMPANY_INFO.phone}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
