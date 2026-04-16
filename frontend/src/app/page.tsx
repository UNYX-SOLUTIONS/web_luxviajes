"use client";

import { HeroCarousel, Button } from "@/components/common";
import {
  DestinationCard,
  PackageCard,
  ServiceCard,
  StatsSection,
  PromotionsMap,
  ServicesDetailSection,
  AppointmentSection,
  CTASection,
} from "@/components/sections";
import { getDestinations, getPackages, getServices } from "@/services";
import { useEffect, useState, useRef } from "react";
import { Destination, Package, Service } from "@/types";

export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [showStats, setShowStats] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cargar datos
    Promise.all([getDestinations(), getPackages(), getServices()]).then(
      ([dest, pkg, serv]) => {
        setDestinations(dest);
        setPackages(pkg);
        setServices(serv);
      },
    );
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Si menos del 90% del Hero es visible, mostrar stats
        // Si 90% o más del Hero es visible, ocultar stats
        setShowStats(entry.intersectionRatio < 0.9);
      },
      { threshold: [0.9] },
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div ref={heroRef}>
        <HeroCarousel />
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
