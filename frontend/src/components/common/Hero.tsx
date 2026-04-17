"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./Button";

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  onClick?: () => void;
}

export function Hero({
  title,
  subtitle,
  ctaText,
  ctaHref = "#",
  onClick,
}: HeroProps = {}) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Image Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/about.png"
          alt="Equipo Lux Viajes"
          fill
          priority
          className="object-fill"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      {/* Content - Contains Vertical Selector and Text */}
      <div className="absolute z-10 text-left text-white flex items-center justify-start h-full gap-18 pl-8 md:pl-16">
        {/* Text Content */}
        <div className="flex-1 pl-8 md:pl-16">
          <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
            {title}
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl text-white!">
            {subtitle}
          </p>
          {onClick ? (
            <Button
              onClick={onClick}
              size="lg"
              variant="primary"
              className="flex items-center gap-2"
            >
              {ctaText}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
          ) : (
            <Link href={ctaHref}>
              <Button
                size="lg"
                variant="primary"
                className="flex items-center gap-2"
              >
                {ctaText}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
