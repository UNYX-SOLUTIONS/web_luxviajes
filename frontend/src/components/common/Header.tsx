"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ChevronDownIcon,
  BriefcaseIcon,
  NewspaperIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { NAVIGATION_LINKS } from "@/constants";
import { cn } from "@/utils/cn";
import { useAuth } from "@/lib/auth-context";
import { AuthDialog } from "@/components/auth/authdialog";
import { Avatar, AvatarFallback } from "@/components/auth/avatar";

interface HeaderProps {
  activeLink?: string;
}

// Opciones secundarias para el menú desplegable "Más"
const SECONDARY_LINKS = [
  {
    label: "Contáctanos",
    href: "/contact",
    icon: EnvelopeIcon,
  },
  {
    label: "Trabaja con nosotros",
    href: "/help#trabaja-con-nosotros",
    icon: BriefcaseIcon,
  },
  {
    label: "Blog",
    href: "/blog",
    icon: NewspaperIcon,
  },
];

export function Header({ activeLink }: HeaderProps) {
  const pathname = usePathname();
  const currentActiveLink = activeLink || pathname;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSecondaryMenu, setShowSecondaryMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const secondaryMenuRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user, logout } = useAuth();

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
      if (
        secondaryMenuRef.current &&
        !secondaryMenuRef.current.contains(event.target as Node)
      ) {
        setShowSecondaryMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserInitials = (firstName?: string, lastName?: string) => {
    const f = (firstName || "").charAt(0).toUpperCase() || "U";
    const l = (lastName || "").charAt(0).toUpperCase();
    return (f + (l || f)).substring(0, 2).toUpperCase();
  };

  // Links principales (excluyendo los que están en SECONDARY_LINKS)
  const MAIN_LINKS = NAVIGATION_LINKS.filter(
    (link) => !SECONDARY_LINKS.some((sec) => sec.href === link.href)
  );

  return (
    <header className="fixed left-0 right-0 top-0 z-50 w-full bg-[#2D0D46]/95 shadow-sm">
      <div className="w-full px-4 sm:px-6 md:px-5 lg:px-8 xl:px-10">
        <div className="flex h-20 items-center md:h-24 lg:h-28 xl:h-32">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <div className="relative w-32 h-12 sm:w-36 sm:h-13 md:w-45 md:h-17.5 lg:w-50 lg:h-18 xl:w-55 xl:h-20 2xl:w-65 2xl:h-25">
              <Image
                src="/images/logo_white.png"
                alt="Luxviajes Logo"
                fill
                className="object-contain object-left"
                loading="eager"
                priority
                sizes="(max-width: 480px) 120px, (max-width: 640px) 140px, (max-width: 768px) 160px, (max-width: 1024px) 180px, (max-width: 1536px) 220px, 320px"
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
            {/* Links Principales */}
            {MAIN_LINKS.map((link) => {
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

            {/* Menú "Más" con opciones secundarias */}
            <div className="relative" ref={secondaryMenuRef}>
              <button
                onClick={() => setShowSecondaryMenu((prev) => !prev)}
                className={cn(
                  `
                    flex items-center gap-1
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
                  showSecondaryMenu
                    ? "border-[#8A3BB7] text-white"
                    : "text-[#CCC6D0] hover:text-purple-400",
                )}
              >
                Más
                <ChevronDownIcon
                  className={cn(
                    "h-3 w-3 transition-transform lg:h-4 lg:w-4",
                    showSecondaryMenu && "rotate-180",
                  )}
                />
              </button>

              {showSecondaryMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black/5 py-1">
                  {SECONDARY_LINKS.map((link) => {
                    const Icon = link.icon;
                    // Verificar si el link está activo (considerando anchors)
                    const isActive = 
                      currentActiveLink === link.href || 
                      (link.href.includes("#") && currentActiveLink === link.href.split("#")[0]);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          `
                            flex items-center gap-3
                            px-4 py-2.5
                            text-sm
                            transition-colors
                          `,
                          isActive
                            ? "bg-primary-50 text-primary-700 font-semibold rounded-xl"
                            : "text-neutral-700 hover:bg-neutral-50 rounded-xl",
                        )}
                        onClick={() => {
                          setShowSecondaryMenu(false);
                        }}
                      >
                        <Icon className="h-4 w-4 text-neutral-400" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Auth / User Menu */}
            {isAuthenticated ? (
              <div className="relative ml-2" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-white/10"
                >
                  <Avatar size="sm" variant="solid" shape="circle">
                    <AvatarFallback>
                      {getUserInitials(user?.primerNombre, user?.apellido)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-[11px] font-medium text-[#CCC6D0] lg:inline lg:text-xs xl:text-sm">
                    {user?.primerNombre?.split(" ")[0]}
                  </span>
                  <ChevronDownIcon
                    className={cn(
                      "hidden h-3 w-3 text-[#CCC6D0] transition-transform lg:inline",
                      showUserMenu && "rotate-180",
                    )}
                  />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black/5">
                    <div className="border-b border-neutral-100 px-4 py-3">
                      <p className="text-sm font-semibold text-neutral-900">
                        {user?.primerNombre || "Usuario"}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm! text-neutral-700 transition-colors hover:bg-neutral-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserCircleIcon className="h-4 w-4" />
                        Mi perfil
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => setShowAuthDialog(true)}
                  className="
                    whitespace-nowrap
                    rounded-lg
                    bg-[#8A3BB7]
                    px-3 py-1.5
                    text-[11px] font-semibold
                    text-white
                    transition-colors
                    hover:bg-[#7B33A5]
                    lg:text-xs lg:px-4
                    xl:text-sm
                  "
                >
                  Iniciar sesión
                </button>
              </div>
            )}
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
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
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
              {/* Links Principales en mobile */}
              {MAIN_LINKS.map((link) => {
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

              {/* Separador para menú secundario en mobile */}
              <div className="border-t border-white/10 pt-3 mt-1">
                <p className="px-4 py-1 text-xs uppercase tracking-wider text-[#CCC6D0]/50">
                  Más opciones
                </p>
                {SECONDARY_LINKS.map((link) => {
                  const Icon = link.icon;
                  const isActive = 
                    currentActiveLink === link.href || 
                    (link.href.includes("#") && currentActiveLink === link.href.split("#")[0]);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        `
                          flex items-center gap-3
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
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile auth buttons */}
              <div className="border-t border-white/10 pt-3 mt-1">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <Avatar size="sm" variant="solid" shape="circle">
                        <AvatarFallback>
                          {getUserInitials(user?.primerNombre, user?.apellido)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">
                          {user?.primerNombre || "Mi Cuenta"}
                        </span>
                        <span className="text-xs text-[#CCC6D0] truncate max-w-50">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="rounded-lg px-4 py-2 text-left font-medium! text-[#CCC6D0] hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Mi perfil
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="rounded-lg px-4 py-2 text-left font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setShowAuthDialog(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="rounded-lg bg-[#8A3BB7] px-4 py-2 text-left font-semibold text-white hover:bg-[#7B33A5] transition-colors"
                    >
                      Iniciar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}

        {/* Auth Dialog Modal */}
        {showAuthDialog && (
          <AuthDialog onClose={() => setShowAuthDialog(false)} />
        )}
      </div>
    </header>
  );
}