"use client";

import { HeroCarousel } from "@/components/common";
import {
  StatsSection,
  PromotionsMap,
  ServicesDetailSection,
  AppointmentSection,
  CTASection,
} from "@/components/sections";
import { useEffect, useRef, useState } from "react";

const HERO_BANNERS = [
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
];

export default function Home() {
  const [showStats, setShowStats] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroElement = heroRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Si menos del 90% del Hero es visible, mostrar stats
        // Si 90% o más del Hero es visible, ocultar stats
        setShowStats(entry.intersectionRatio < 0.9);
      },
      { threshold: [0.9] },
    );

    if (heroElement) {
      observer.observe(heroElement);
    }

    return () => {
      if (heroElement) {
        observer.unobserve(heroElement);
      }
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div ref={heroRef}>
        <HeroCarousel slides={HERO_BANNERS} />
      </div>

      {/* Stats Section - Overlapping Hero and PromotionsMap - Show on interaction */}
      <div
        className={`relative z-10 transition-opacity duration-500 ${showStats ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <StatsSection />
      </div>

      {/* Promotions Map Section */}
      <PromotionsMap />

      {/* Services Detail Section */}
      <ServicesDetailSection />

      {/* Appointment Section */}
      <AppointmentSection />

      {/* CTA Section */}
      <CTASection />
    </>
  );
}
