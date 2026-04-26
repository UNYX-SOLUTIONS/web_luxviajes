"use client";

import { ContactDialog, HeroCarousel } from "@/components/common";
import {
  StatsSection,
  ServicesDetailSection,
  AppointmentSection,
  CTASection,
} from "@/components/sections";
import { useEffect, useRef, useState } from "react";
import { XMarkIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";
import { DreamDestinationsSection } from "./packages/components";
import { type DreamDestination } from "./packages/data/packages-data";
import { useHomeData } from "@/hooks";

interface PackageDetails {
  title: string;
  description: string;
  duration: string;
  price: string;
  included: string[];
  highlights?: string[];
  pdf?: string; // URL del PDF desde Strapi
}

export default function Home() {
  const { data: homeData, loading, error } = useHomeData();
  const [showStats, setShowStats] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageDetails | null>(
    null,
  );

  // Usar banners de la API o fallback a datos locales
  const heroSlides = homeData?.banners || [];

  // Transformar destinos de Strapi a formato DreamDestination
  const dreamDestinations: DreamDestination[] = (homeData?.destinos || []).map((destino) => ({
    title: destino.titulo,
    image: destino.imagen || "",
    description: destino.descripcion,
    duration: destino.duracion,
    nights: destino.subtitulo,
    season: destino.disponibilidad,
    included: destino.descripcion.split("\n").filter(line => line.trim()), // Para las cards
    detailIncluded: destino.descripcionDetallada.split("\n").filter(line => line.trim()), // Para el diálogo
    price: destino.precio,
    pdf: destino.pdf,
  }));

  // Transformar servicios de Strapi para ServicesDetailSection
  const servicesData = (homeData?.servicios || []).map((servicio) => ({
    id: servicio.documentId,
    title: servicio.titulo,
    label: servicio.titulo,
    image: servicio.imagen || "",
    description: servicio.subtitulo,
  }));

  const handleOpenDetails = (pkg: DreamDestination) => {
    const packageDetails: PackageDetails = {
      title: pkg.title,
      description: pkg.season,
      duration: pkg.duration,
      price: pkg.price || "Consultar",
      included: pkg.detailIncluded || pkg.included || [], // Usar detailIncluded en el diálogo
      pdf: pkg.pdf, // Incluir URL del PDF
    };
    setSelectedPackage(packageDetails);
    setShowDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setShowDetailsDialog(false);
    setSelectedPackage(null);
  };

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
        {loading ? (
          <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-primary-900 to-primary-800">
            <div className="text-center text-white">
              <div className="mb-4 flex justify-center">
                <div className="h-12 w-12 border-4 border-primary-200 border-t-white rounded-full animate-spin"></div>
              </div>
              <p className="text-lg">Cargando experiencias...</p>
            </div>
          </div>
        ) : error ? (
          <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-primary-900 to-primary-800">
            <div className="text-center text-white">
              <p className="text-lg mb-2">Error al cargar los datos</p>
              <p className="text-sm opacity-75">Por favor, recarga la página</p>
            </div>
          </div>
        ) : heroSlides.length > 0 ? (
          <HeroCarousel slides={heroSlides} />
        ) : (
          <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-primary-900 to-primary-800">
            <div className="text-center text-white">
              <p className="text-lg">Sin banners disponibles</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Section - Overlapping Hero and PromotionsMap - Show on interaction */}
      <div
        className={`relative z-10 transition-opacity duration-500 ${showStats ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <StatsSection stats={homeData?.stats} />
      </div>

      {/* Dream Destinations Section */}
      {!loading && dreamDestinations.length > 0 && (
        <DreamDestinationsSection
          destinations={dreamDestinations}
          onDetalles={(destination) => handleOpenDetails(destination)}
          maxCards={4}
          showScrollControls={false}
        />
      )}

      {/* Services Detail Section */}
      {!loading && servicesData.length > 0 && (
        <ServicesDetailSection 
          services={servicesData} 
          serviciosTitulo={homeData?.serviciosTitulo}
          serviciosDescripcion={homeData?.serviciosDescripcion}
        />
      )}

      {/* Appointment Section */}
      <AppointmentSection 
        citaTitulo={homeData?.citaTitulo}
        citaSubtitulo={homeData?.citaSubtitulo}
        citaUrgencia={homeData?.citaUrgencia}
      />

      {/* CTA Section */}
      <CTASection 
        llamadaTitulo={homeData?.llamadaTitulo}
        llamadaSubtitulo={homeData?.llamadaSubtitulo}
      />

      {/* Contact Dialog */}
      <ContactDialog
        isOpen={showContactDialog}
        onClose={() => setShowContactDialog(false)}
      />

      {/* Details Dialog */}
      {showDetailsDialog && selectedPackage && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl flex flex-col max-h-[90vh] z-1000">
            {/* Header */}
            <div className="shrink-0 border-b border-neutral-200 bg-white px-8 py-6">
              <button
                onClick={handleCloseDetailsDialog}
                className="absolute right-6 top-6 rounded-full bg-neutral-100 p-2 hover:bg-neutral-200 transition"
              >
                <XMarkIcon className="h-6 w-6 text-neutral-700" />
              </button>

              <div className="pr-10">
                <h2 className="text-3xl font-bold text-neutral-900">
                  {selectedPackage.title}
                </h2>
                <p className="text-sm text-neutral-600 mt-2">
                  {selectedPackage.description}
                </p>
              </div>
            </div>

            {/* Dialog Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8 md:p-10">
              {/* Quick Info */}
              <div className="mb-8 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-primary-50 p-4">
                  <p className="text-xs font-semibold text-primary-700 uppercase tracking-wider">
                    Duración
                  </p>
                  <p className="mt-2 text-lg font-bold text-neutral-900">
                    {selectedPackage.duration}
                  </p>
                </div>
                <div className="rounded-lg bg-tertiary-50 p-4">
                  <p className="text-xs font-semibold text-tertiary-700 uppercase tracking-wider">
                    Precio
                  </p>
                  <p className="mt-2 text-lg font-bold text-neutral-900">
                    ${selectedPackage.price} USD
                  </p>
                </div>
              </div>

              {/* Included */}
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">
                  Incluye
                </h3>
                <ul className="space-y-3">
                  {selectedPackage.included.map((item: string, idx: number) => (
                    <li key={idx} className="flex gap-3">
                      <CheckBadgeIcon className="h-5 w-5 shrink-0 text-primary-700 mt-0.5" />
                      <span className="text-sm text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Buttons - Fixed at bottom */}
            <div className="shrink-0 border-t border-neutral-200 bg-white px-8 py-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  handleCloseDetailsDialog();
                  setShowContactDialog(true);
                }}
                className="flex-1 rounded-full bg-primary-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-800 cursor-pointer"
              >
                Reservar Ahora
              </button>
              {selectedPackage.pdf && (
                <button className="flex-1 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 cursor-pointer">
                  <a
                    href={selectedPackage.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Descargar PDF
                  </a>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
