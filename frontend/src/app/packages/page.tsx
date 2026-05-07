"use client";

import { useState, useMemo } from "react";
import { XMarkIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";
import { ContactDialog } from "@/components/common/contact_dialog";
import { usePaqueteData } from "@/hooks";
import type { TopDestinosMes, PaquetePremium, ParqueTematico } from "@/types";
import {
  HeroSection,
  DreamDestinationsSection,
  PremiumPackagesSection,
  ThemeParksSection,
  CtaSection,
  NewsletterSection,
} from "./components";
import {
  type PremiumPackage,
  type DreamDestination,
} from "./data/packages-data";

interface PackageDetails {
  title: string;
  description: string;
  duration: string;
  price: string;
  included: string[];
  pdf?: string;
  highlights?: string[];
}

// Funciones de mapeo para convertir datos del API a interfaces locales
function mapDestinoToDestination(destino: TopDestinosMes): DreamDestination {
  // console.log("Mapeando destino:", destino);

  return {
    title: destino.titulo,
    image: destino.imagen || "",
    description: destino.descripcion || "",
    duration: destino.duracion,
    nights: destino.subtitulo,
    season: destino.disponibilidad,
    price: destino.precio,
    included: (destino.descripcion || "").split("\n").filter(line => line.trim()), // Para las cards
    detailIncluded: (destino.descripcionDetallada || "").split("\n").filter(line => line.trim()), // Para el diálogo
    pdf: destino.pdf || undefined,
  };
}

function mapPaqueteToPremium(paquete: PaquetePremium): PremiumPackage {
  // Parsear descripcion para extraer highlights/included
  const lines = paquete.descripcion
    ? paquete.descripcion
        .split(/\n|•/)
        .filter((line) => line.trim())
        .map((line) => line.trim())
    : [];

  return {
    tag: paquete.etiqueta,
    title: paquete.titulo,
    days: paquete.dias,
    price: paquete.precio,
    image: paquete.imagen || "",
    description: paquete.descripcion,
    duration: paquete.duracion,
    season: paquete.etiqueta,
    highlights: lines,
    included: lines,
    pdf: paquete.pdf || undefined,
  };
}

function mapParqueToThemePark(parque: ParqueTematico) {
  return {
    id: parque.documentId,
    title: parque.titulo,
    subtitle: parque.subtitulo || "",
    image: parque.imagen || "",
  };
}

export default function PackagesPage() {
  const { data: paqueteData, loading, error } = usePaqueteData();
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageDetails | null>(null);

  // Mapear datos del API a interfaces locales usando useMemo
  const dreamDestinations = useMemo(() => {
    return paqueteData?.topDestinosMes?.map(mapDestinoToDestination) || [];
  }, [paqueteData?.topDestinosMes]);

  const premiumPackages = useMemo(() => {
    return paqueteData?.paquete_premiums?.map(mapPaqueteToPremium) || [];
  }, [paqueteData?.paquete_premiums]);

  const themeParks = useMemo(() => {
    return paqueteData?.parquesTematicos?.map(mapParqueToThemePark) || [];
  }, [paqueteData?.parquesTematicos]);

  const handleOpenDetails = (pkg: PremiumPackage | DreamDestination) => {
    const packageDetails: PackageDetails = {
      title: pkg.title,
      description: pkg.season,
      duration: pkg.duration,
      price: pkg.price || "Consultar",
      included: pkg.detailIncluded || pkg.included || [], // Usar detailIncluded en el diálogo
      pdf: pkg.pdf,
    };
    setSelectedPackage(packageDetails);
    setShowDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setShowDetailsDialog(false);
    setSelectedPackage(null);
  };

  return (
    <>
      <HeroSection />

      {/* Dream Destinations Section with Loading */}
      {loading ? (
        <div className="w-full py-20 flex items-center justify-center bg-neutral-50">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-700 rounded-full animate-spin"></div>
            </div>
            <p className="text-lg text-neutral-700">Cargando destinos...</p>
          </div>
        </div>
      ) : error ? (
        <div className="w-full py-20 flex items-center justify-center bg-neutral-50">
          <div className="text-center">
            <p className="text-lg text-neutral-900 mb-2">Error al cargar los destinos</p>
            <p className="text-sm text-neutral-600">Por favor, recarga la página</p>
          </div>
        </div>
      ) : dreamDestinations.length > 0 ? (
        <DreamDestinationsSection
          destinations={dreamDestinations}
          onDetalles={(destination) => handleOpenDetails(destination)}
          maxCards={8}
          showScrollControls={true}
        />
      ) : null}

      {/* Premium Packages Section with Loading */}
      {!loading && error ? (
        <div className="w-full py-20 flex items-center justify-center bg-neutral-50">
          <div className="text-center">
            <p className="text-lg text-neutral-900 mb-2">Error al cargar los paquetes</p>
            <p className="text-sm text-neutral-600">Por favor, recarga la página</p>
          </div>
        </div>
      ) : !loading && premiumPackages.length > 0 ? (
        <PremiumPackagesSection
          packages={premiumPackages}
          onDetalles={(pkg) => handleOpenDetails(pkg)}
        />
      ) : null}

      {!loading && <ThemeParksSection parks={themeParks} />}

      {!loading && (
        <>
          <CtaSection 
            onContactClick={() => setShowContactDialog(true)}
            titulo={paqueteData?.llamadaTitulo}
            subtitulo={paqueteData?.llamadaSubtitulo}
          />

          <NewsletterSection 
            titulo={paqueteData?.boletinTitulo}
            descripcion={paqueteData?.boletinDescripcion}
          />
        </>
      )}

      {/* Details Dialog */}
      {showDetailsDialog && selectedPackage && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 p-4 rounded-lg">
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
                  {selectedPackage.description }
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
                    Precio desde
                  </p>
                  <p className="mt-2 text-lg font-bold text-neutral-900">
                    ${selectedPackage.price} USD
                  </p>
                </div>
              </div>

            
            

              {/* Included */}
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">
                  {selectedPackage.highlights && selectedPackage.highlights.length > 0 ? "Lo que está incluido" : "Incluye"}
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
            <div className="shrink-0 border-t border-neutral-200 bg-white px-8 py-6 flex flex-col gap-3 sm:flex-row items-center justify-center">
              <button
                onClick={() => {
                  handleCloseDetailsDialog();
                  setShowContactDialog(true);
                }}
                className="flex-1 max-w-xs rounded-full bg-primary-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-800 cursor-pointer"
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

      <ContactDialog
        isOpen={showContactDialog}
        onClose={() => setShowContactDialog(false)}
      />
    </>
  );
}
