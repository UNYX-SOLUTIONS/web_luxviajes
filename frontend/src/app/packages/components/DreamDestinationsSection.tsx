"use client";

import Image from "next/image";
import Link from "next/link";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import type { DreamDestination } from "../data/packages-data";

interface DreamDestinationsSectionProps {
  destinations: DreamDestination[];
  onDetalles: (destination: DreamDestination) => void;
}

export const DreamDestinationsSection: FC<DreamDestinationsSectionProps> = ({
  destinations,
  onDetalles,
}) => {
  const handleDownloadPDF = (title: string) => {
    const filename = `${title.toLowerCase().replace(/\s+/g, "-")}.pdf`;
    const link = document.createElement("a");
    link.href = `/pdfs/${filename}`;
    link.download = filename;
    link.click();
  };

  return (
    <section className="bg-neutral-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm text-accent-red">Escapa, Explora, Disfruta</p>
            <h2 className="mt-1 text-4xl font-bold text-primary-700">
              Top Destinos del Mes
            </h2>
          </div>
          <Link
            href="/contact"
            className="text-sm font-semibold text-primary-700 transition hover:text-primary-800"
          >
            Ver mas destinos populares →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-primary-100 flex flex-col h-full"
            >
              <div className="relative h-40 w-full shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-4 flex flex-col h-full">
                <div className="shrink-0">
                  <h4 className="text-lg font-bold text-neutral-900 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-sm text-primary-700! font-semibold">
                    ● {item.nights}
                  </p>
                </div>
                <ul className="mt-2 space-y-3 text-xs text-neutral-700 shrink-0">
                  <li>✈ Vuelo</li>
                  <li>🏨 Hotel</li>
                  <li>🧭 Tours</li>
                  <li>🛡 Asistencia de viaje</li>
                </ul>
                <div className="grow" />
                <div className="shrink-0">
                  <p className="mt-2 text-xs text-tertiary-700! font-medium text-center">
                    {item.season}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => onDetalles(item)}
                      className="flex-1 rounded-full bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800"
                    >
                      Ver detalles
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(item.title)}
                      className="rounded-full border-2 border-primary-700 p-2.5 text-primary-700 transition hover:bg-primary-50 flex items-center justify-center flex-1 gap-2 text-sm font-semibold"
                      title="Descargar PDF"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4" />
                      Descargar
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
