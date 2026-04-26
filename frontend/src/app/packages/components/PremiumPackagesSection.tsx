"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { ClockIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import type { FC } from "react";
import { useState } from "react";
import type { PremiumPackage } from "../data/packages-data";

interface PremiumPackagesSectionProps {
  packages: PremiumPackage[];
  onDetalles: (pkg: PremiumPackage) => void;
}

const ITEMS_PER_VIEW = 4;

export const PremiumPackagesSection: FC<PremiumPackagesSectionProps> = ({
  packages,
  onDetalles,
}) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const maxIndex = Math.max(0, packages.length - ITEMS_PER_VIEW);
 

  
  const handleDownloadPDF = (pdfUrl?: string, title?: string) => {
    if (!pdfUrl) return;
    
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = title ? `${title.toLowerCase().replace(/\s+/g, "-")}.pdf` : "download.pdf";
    link.target = "_blank";
    link.click();
  };


  const handlePrev = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visiblePackages = packages.slice(
    carouselIndex,
    carouselIndex + ITEMS_PER_VIEW,
  );

  return (
    <section className="bg-neutral-100 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-4xl font-bold text-primary-700 mb-2">
              Paquetes Premium
            </h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-600">
              Nuestra seleccion exclusiva de itinerarios curados para ofrecer el
              maximo confort y experiencias autenticas.
            </p>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={handlePrev}
              disabled={carouselIndex === 0}
              className="h-9 w-9 rounded-full border border-neutral-300 text-neutral-600 transition hover:border-primary-400 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={carouselIndex === maxIndex}
              className="h-9 w-9 bg-primary-600 hover:bg-primary-500 rounded-full border border-primary-800 text-neutral-50 transition hover:border-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visiblePackages.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200"
            >
              <div className="relative h-80 w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary-900 via-primary-900/10 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-neutral-900/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                  {item.tag}
                </span>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex text-center items-center gap-1">
                    <ClockIcon className="h-3 w-3 inline-block mr-1" />
                    <p className="text-xs text-white!">{item.days}</p>
                  </div>
                  <h4 className="font-bold">{item.title}</h4>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500! font-semibold">
                      Desde
                    </p>
                    <p className="text-xl font-bold text-primary-700!">
                      ${item.price} USD
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => onDetalles(item)}
                    className="flex-1 rounded-full bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800"
                  >
                    Ver detalles
                  </button>
                
                          {item.pdf && (
                            <button
                              onClick={() =>
                                handleDownloadPDF(item.pdf, item.title)
                              }
                              className="flex-1 rounded-full border-2 border-primary-700 p-2.5 text-primary-700 transition hover:bg-primary-50 flex items-center justify-center gap-2 text-sm font-semibold"
                            >
                              <DocumentArrowDownIcon className="h-4 w-4" />
                              Descargar
                            </button>
                          )}
                  
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
