"use client";

import { useState } from "react";
import { XMarkIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";
import { ContactDialog } from "@/components/common/contact_dialog";
import {
  HeroSection,
  DreamDestinationsSection,
  PremiumPackagesSection,
  ThemeParksSection,
  CtaSection,
  NewsletterSection,
} from "./components";
import {
  premiumPackages,
  dreamDestinations,
  themeParks,
  type PremiumPackage,
  type DreamDestination,
} from "./data/packages-data";

interface PackageDetails {
  title: string;
  description: string;
  duration: string;
  price: string;
  included: string[];
  highlights?: string[];
}

export default function PackagesPage() {
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageDetails | null>(null);

  const handleOpenDetails = (pkg: PremiumPackage | DreamDestination) => {
    const packageDetails: PackageDetails = {
      title: pkg.title,
      description: pkg.description,
      duration: pkg.duration,
      price: pkg.price || "Consultar",
      included: pkg.included || [],
      highlights: (pkg as PremiumPackage).highlights,
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

      <DreamDestinationsSection
        destinations={dreamDestinations}
        onDetalles={(destination) => handleOpenDetails(destination)}
      />

      <PremiumPackagesSection
        packages={premiumPackages}
        onDetalles={(pkg) => handleOpenDetails(pkg)}
      />

      <ThemeParksSection parks={themeParks} />

      <CtaSection onContactClick={() => setShowContactDialog(true)} />

      <NewsletterSection />

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

              {/* Highlights */}
              {selectedPackage.highlights && selectedPackage.highlights.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">
                    Puntos Destacados
                  </h3>
                  <ul className="space-y-2">
                    {selectedPackage.highlights.map((highlight: string, idx: number) => (
                      <li key={idx} className="flex gap-3">
                        <CheckBadgeIcon className="h-5 w-5 shrink-0 text-primary-700 mt-0.5" />
                        <span className="text-sm text-neutral-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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
              {/* <button className="flex-1 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 cursor-pointer">
                <a
                  href={`/pdfs/${selectedPackage.title?.toLowerCase().replace(/\s/g, "_")}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Descargar PDF
                </a>
              </button> */}
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
