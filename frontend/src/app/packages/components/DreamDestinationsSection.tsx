"use client";

import Image from "next/image";
import Link from "next/link";
import {
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
 
import type { FC } from "react";
import type { DreamDestination } from "../data/packages-data";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
 interface DreamDestinationsSectionProps {
  destinations: DreamDestination[];
  onDetalles: (destination: DreamDestination) => void;
  maxCards?: number;
  showScrollControls?: boolean;
 
}
 
export const DreamDestinationsSection: FC<
  DreamDestinationsSectionProps
> = ({
  destinations,
  onDetalles,
  maxCards = destinations.length,
  showScrollControls = false,
 
}) => {
  const [page, setPage] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(destinations.length / maxCards);

  const startIndex = page * maxCards;
  const visibleDestinations = destinations.slice(
    startIndex,
    startIndex + maxCards
  );

  const handleDownloadPDF = (pdfUrl?: string, title?: string) => {
    if (!pdfUrl) return;
    
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = title ? `${title.toLowerCase().replace(/\s+/g, "-")}.pdf` : "download.pdf";
    link.target = "_blank";
    link.click();
  };

  // ✅ FIX REAL: evita salto de scroll
  const handlePageChange = (newPage: number) => {
    if (newPage === page) return;

    const sectionTop =
      sectionRef.current?.getBoundingClientRect().top ?? 0;

    setPage(newPage);

    requestAnimationFrame(() => {
      window.scrollBy({
        top: sectionTop - 100, // ajusta según altura de tu navbar
        behavior: "instant", // usa "smooth" si quieres animación
      });
    });
  };

  const getPaginationItems = (
    currentPage: number,
    totalPages: number
  ) => {
    const current = currentPage + 1;
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(totalPages - 1, current + delta);
      i++
    ) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (
      totalPages > 1 &&
      rangeWithDots[rangeWithDots.length - 1] !== totalPages
    ) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };
 
 
  return (
    
    <section
      ref={sectionRef}
      className="bg-neutral-50 py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-7 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm text-accent-red">
              Escapa, Explora, Disfruta
            </p>
            <h2 className="mt-1 text-4xl font-bold text-primary-700">
              Top Destinos del Mes
            </h2>
          </div>

          {!showScrollControls && (
            <Link
              href="/packages"
              className="text-sm font-semibold text-primary-700 transition hover:text-primary-800"
            >
              Ver más destinos populares →
            </Link>
          )}
        </div>

        {/* GRID ANIMADO */}
        <div className="relative overflow-hidden">
          <div style={{ minHeight: "420px" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.35,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
              >
                {visibleDestinations.map((item) => (
                  <article
                    key={item.title}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-primary-100 flex flex-col h-full"
                  >
                    {/* IMAGE */}
                    <div className="relative h-40 w-full shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 flex flex-col h-full">
                      <div className="shrink-0">
                        <h4 className="text-lg font-bold text-neutral-900 line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-sm text-primary-700 font-semibold">
                          ● {item.nights}
                        </p>
                      </div>

                      <ul className="mt-2 space-y-1 text-xs text-neutral-700 shrink-0">
                        {item.included.slice(0, 4).map((includedItem, idx) => (
                          <li key={idx} className="line-clamp-1">{includedItem}</li>
                        ))}
                      </ul>

                      <div className="grow" />

                      <div className="shrink-0">
                        <p className="mt-2 text-xs text-tertiary-700 font-medium text-center">
                          {item.season}
                        </p>

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
                    </div>
                  </article>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* PAGINACIÓN */}
        {showScrollControls && totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() =>
                handlePageChange(Math.max(0, page - 1))
              }
              disabled={page === 0}
              className={`p-2 rounded-full transition ${
                page === 0
                  ? "bg-neutral-200 text-neutral-400"
                  : "bg-neutral-200 hover:bg-neutral-300"
              }`}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>

            {getPaginationItems(page, totalPages).map(
              (item, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof item === "number" &&
                    handlePageChange(item - 1)
                  }
                  disabled={typeof item !== "number"}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                    item === page + 1
                      ? "bg-primary-700 text-white"
                      : typeof item === "number"
                      ? "bg-neutral-200 hover:bg-neutral-300"
                      : "text-neutral-500 cursor-default"
                  }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              onClick={() =>
                handlePageChange(
                  Math.min(totalPages - 1, page + 1)
                )
              }
              disabled={page === totalPages - 1}
              className={`p-2 rounded-full transition ${
                page === totalPages - 1
                  ? "bg-neutral-200 text-neutral-400"
                  : "bg-neutral-200 hover:bg-neutral-300"
              }`}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* PAGINACIÓN */}
        {showScrollControls && totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() =>
                handlePageChange(Math.max(0, page - 1))
              }
              disabled={page === 0}
              className={`p-2 rounded-full transition ${
                page === 0
                  ? "bg-neutral-200 text-neutral-400"
                  : "bg-neutral-200 hover:bg-neutral-300"
              }`}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>

            {getPaginationItems(page, totalPages).map(
              (item, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof item === "number" &&
                    handlePageChange(item - 1)
                  }
                  disabled={typeof item !== "number"}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                    item === page + 1
                      ? "bg-primary-700 text-white"
                      : typeof item === "number"
                      ? "bg-neutral-200 hover:bg-neutral-300"
                      : "text-neutral-500 cursor-default"
                  }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              onClick={() =>
                handlePageChange(
                  Math.min(totalPages - 1, page + 1)
                )
              }
              disabled={page === totalPages - 1}
              className={`p-2 rounded-full transition ${
                page === totalPages - 1
                  ? "bg-neutral-200 text-neutral-400"
                  : "bg-neutral-200 hover:bg-neutral-300"
              }`}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};