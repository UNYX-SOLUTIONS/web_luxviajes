"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { NAVIGATION_LINKS } from "@/constants";
import { cn } from "@/utils/cn";
import { useAuth } from "@/lib/auth-context";
import { AuthDialog } from "@/components/auth/authdialog";
import { Avatar, AvatarFallback } from "@/components/auth/avatar";

interface HeaderProps {
  activeLink?: string;
}

export function Header({ activeLink }: HeaderProps) {
  const pathname = usePathname();
  const currentActiveLink = activeLink || pathname;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
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
                  <svg
                    className={cn(
                      "hidden h-3 w-3 text-[#CCC6D0] transition-transform lg:inline",
                      showUserMenu && "rotate-180",
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
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
                {/* <Link
                  href="/auth/login"
                  className="
                    whitespace-nowrap
                    rounded-lg
                    px-3 py-1.5
                    text-[11px] font-medium
                    text-[#CCC6D0]
                    transition-colors
                    hover:text-white
                    lg:text-xs lg:px-4
                    xl:text-sm
                  "
                >
                  Iniciar sesión
                </Link> */}
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
                    {/* <Link
                      href="/auth/login"
                      className="rounded-lg px-4 py-2 font-medium text-[#CCC6D0] hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Iniciar sesión
                    </Link> */}
                    <button
                      onClick={() => {
                        setShowAuthDialog(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="rounded-lg bg-[#8A3BB7] px-4 py-2 text-left font-semibold text-white hover:bg-[#7B33A5] transition-colors"
                    >
                      Inciar sesión
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
