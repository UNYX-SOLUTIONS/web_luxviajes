"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./Button";
import { cn } from "@/utils/cn";
import { trackWhatsAppClick, trackPhoneClick } from "@/lib/analytics";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRedSocial } from "@/hooks";

interface BannerSlide {
  image: string;
  title: string;
  subtitle: string;
}

interface HeroCarouselProps {
  slides?: BannerSlide[];
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export function HeroCarousel({
  slides = [
    {
      image: "/images/hero/banner1.png",
      title: "MALDIVAS",
      subtitle: "Un amanecer sereno en villas sobre el agua turquesa",
    },
    {
      image: "/images/hero/banner2.png",
      title: "ITALIA",
      subtitle: "Una vista clásica y lujosa de la Costa Amalfitana",
    },
    {
      image: "/images/hero/banner3.png",
      title: "JAPÓN",
      subtitle: "Un jardín zen otoñal que transmite una paz absoluta",
    },
    {
      image: "/images/hero/banner4.png",
      title: "TAILANDIA",
      subtitle: "Un paisaje de aventura y felicidad en aguas cristalinas",
    },
  ],
  ctaText = "Explorar",
  ctaHref = "packages",
  className,
}: HeroCarouselProps) {
  const { data: redes } = useRedSocial();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [, setShowSearchForm] = useState(false);

  // Mostrar el formulario de búsqueda después de 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSearchForm(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Cachear los slides con useMemo
  const cachedSlides = useMemo(() => slides, [slides]);

  // El componente Image de Next.js ya cachea automáticamente
  // No necesitamos precargar manualmente

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % cachedSlides.length,
        );
        setIsTransitioning(false);
      }, 800);
    }, 7000);

    return () => clearInterval(interval);
  }, [cachedSlides.length]);

  // Cachear la función handleDotClick con useCallback
  const handleDotClick = useCallback((index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setIsTransitioning(false);
    }, 800);
  }, []);

  return (
    <section
      className={cn("relative h-screen w-full overflow-hidden", className)}
    >
      {/* Carousel Container - All images side by side */}
      <div
        className="absolute inset-0 flex transition-transform"
        style={{
          transform: `translateX(-${currentImageIndex * 100}%)`,
          transitionDuration: isTransitioning ? "800ms" : "0ms",
        }}
      >
        {cachedSlides.map((slide, index) => (
          <div
            key={`${slide.image || "slide"}-${slide.title}-${index}`}
            className="relative w-full h-full shrink-0"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              quality={85}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content - Contains Vertical Selector and Text */}
      <div className="absolute z-10 text-left text-white flex items-center justify-start h-full gap-18 pl-8 md:pl-16 py-10">
        {/* Vertical Selector */}
        <div className="flex flex-col items-center gap-8 h-64 shrink-0">
          <div className="relative w-0.5 h-full bg-white/30 rounded-full">
            {cachedSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300",
                  currentImageIndex === index
                    ? "w-12 h-12 bg-white/80 flex items-center justify-center text-[#500088] font-bold text-sm"
                    : "w-3 h-3 bg-white/60 hover:bg-white/70",
                )}
                style={{
                  top: `${(index / (cachedSlides.length - 1)) * 100}%`,
                }}
              >
                {currentImageIndex === index && index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <div className="text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] xl:text-[6rem] 2xl:text-[6rem] font-bold font-manrope mb-4 leading-none">
            {cachedSlides[currentImageIndex].title}
          </div>
          <p className="text-lg md:text-xl mb-8 max-w-2xl text-white!">
            {cachedSlides[currentImageIndex].subtitle}
          </p>
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
        </div>
      </div>

    {/*   <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 max-w-4xl text-center bottom-24 z-20 w-full px-4  duration-1000",
          showSearchForm ? "opacity-100" : "opacity-0",
        )}
      >
        <h3 className="text-2xl font-extrabold leading-tight md:text-7xl text-white! mb-6">
          Consulta tus dudas o personaliza tu viaje ideal con nosotros
        </h3>

        <form className="mx-auto w-full">
          <div className="flex items-center rounded-full px-6 py-4 shadow-lg bg-[#D9D9D9]/40 backdrop-blur-sm focus-within:ring-1 focus-within:ring-neutral-200 transition-all">
            <MagnifyingGlassIcon className="mr-4 h-6 w-6 text-neutral-50 shrink-0" />
            <input
              type="text"
              placeholder="Déjanos tus dudas o consultas..."
              className="w-full text-base md:text-lg text-neutral-50 outline-none placeholder:text-neutral-50"
            />
          </div>
        </form>
      </div> */}

      {/* Top Right CTA Buttons - WhatsApp and Contact */}
      <div className="absolute top-48 right-8 z-20 flex flex-col sm:flex-row items-center gap-3">
        {/* Contact Button */}
        <button
          onClick={() => {
            trackPhoneClick();
            const phoneNumber = redes?.llamada || "+593964220600";
            window.location.href = `tel:${phoneNumber}`;
          }}
          className="bg-[#D9D9D9]/40 text-white font-bold h-12 py-0 flex items-center justify-center text-base px-6 rounded-full hover:bg-white hover:text-[#500088] transition-all"
        >
          Llámanos {redes?.llamada || "+593 96 422 0600"}
        </button>

        {/* WhatsApp Button */}
        <button
          onClick={() => {
            trackWhatsAppClick();
            const whatsappNumber = redes?.whatsapp?.replace(/[^0-9]/g, '') || "593964220600";
            window.open(`https://wa.me/${whatsappNumber}`, "_blank");
          }}
          className="w-12 h-12 rounded-full bg-[#D9D9D9]/40 hover:bg-white transition-all text-white hover:text-[#500088] flex items-center justify-center"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_292_749)">
              <path
                d="M0 27.43L1.97 20.09C0.85 18.08 0.27 15.83 0.27 13.55C0.27 6.08 6.34 0 13.81 0C21.28 0 27.36 6.08 27.36 13.55C27.36 21.02 21.28 27.1 13.81 27.1C11.57 27.1 9.35 26.53 7.37 25.46L0 27.43ZM7.74 22.71L8.2 22.99C9.91 24.01 11.84 24.54 13.81 24.54C19.87 24.54 24.8 19.61 24.8 13.55C24.8 7.49 19.87 2.56 13.81 2.56C7.75 2.56 2.83 7.49 2.83 13.54C2.83 15.54 3.39 17.51 4.44 19.24L4.72 19.71L3.62 23.81L7.74 22.71Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.85 15.43C18.29 15.1 17.57 14.72 16.91 14.99C16.41 15.2 16.08 15.98 15.76 16.39C15.59 16.6 15.39 16.63 15.14 16.53C13.25 15.78 11.8 14.51 10.75 12.77C10.57 12.5 10.6 12.29 10.82 12.04C11.14 11.67 11.53 11.25 11.62 10.75C11.71 10.25 11.47 9.66999 11.26 9.21999C11 8.64999 10.7 7.83999 10.13 7.51999C9.60002 7.21999 8.91002 7.38999 8.45002 7.76999C7.64002 8.42999 7.25002 9.44999 7.27002 10.47C7.27002 10.76 7.31002 11.05 7.38002 11.33C7.54002 12 7.85002 12.63 8.20002 13.23C8.46002 13.68 8.75002 14.12 9.06002 14.54C10.07 15.91 11.33 17.11 12.79 18C13.52 18.45 14.3 18.84 15.12 19.11C16.03 19.41 16.84 19.72 17.83 19.54C18.86 19.34 19.87 18.71 20.28 17.71C20.4 17.42 20.46 17.09 20.39 16.78C20.25 16.14 19.38 15.75 18.86 15.44L18.85 15.43Z"
                fill="currentColor"
              />
            </g>
          </svg>
        </button>
      </div>

      {/* Social Media Icons - Bottom Right */}
      <div className="absolute bottom-8 right-8 z-20 flex flex-col items-center gap-4">
        <Link
          href={redes?.instagram || "https://www.instagram.com/luxviajes.ec"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-[#D9D9D9]/40 flex items-center justify-center hover:bg-white transition-all text-white hover:text-[#500088]"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
          </svg>
        </Link>
        <Link
          href={redes?.facebook || "https://www.facebook.com/luxviajes.ec"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-[#D9D9D9]/40 flex items-center justify-center hover:bg-white transition-all text-white hover:text-[#500088]"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </Link>
        <Link
          href={redes?.tiktok || "https://www.tiktok.com/@luxviajes.ec"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-[#D9D9D9]/40 flex items-center justify-center hover:bg-white transition-all text-white hover:text-[#500088]"
        >
          <svg width="20" height="20" viewBox="0 0 23 23" fill="none">
            <path
              d="M11.3145 0C17.5631 9.07103e-05 22.6289 5.0658 22.6289 11.3145C22.6288 17.563 17.563 22.6288 11.3145 22.6289C5.0658 22.6289 8.86512e-05 17.5631 0 11.3145C0 5.06575 5.06575 0 11.3145 0ZM11.4023 2.51465L11.376 13.9209C11.376 15.3207 10.1381 16.4229 8.73828 16.4229C7.33863 16.4227 6.20508 15.2893 6.20508 13.8896C6.20523 12.4901 7.33872 11.3566 8.73828 11.3564C8.84274 11.3564 8.94764 11.3772 9.04688 11.3877V8.94336C8.94241 8.93814 8.84274 8.92773 8.73828 8.92773C5.9964 8.92787 3.77164 11.1478 3.77148 13.8896C3.77148 16.6317 5.99131 18.8574 8.7334 18.8574C11.4755 18.8574 13.7002 16.6317 13.7002 13.8896V7.17285C14.5045 8.40549 15.8787 9.14746 17.3516 9.14746C17.4195 9.14745 17.4861 9.14455 17.5527 9.14062L17.7588 9.12695V6.40527C15.6541 6.25382 13.9618 4.61408 13.7422 2.51465H11.4023Z"
              fill="currentColor"
            />
          </svg>
        </Link>
        <Link
          href={redes?.youtube || "https://www.youtube.com/@LuxViajesPodcast"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-[#D9D9D9]/40 flex items-center justify-center hover:bg-white transition-all text-white hover:text-[#500088]"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
