"use client";

import Image from "next/image";
import { usePaqueteData } from "@/hooks";

function parseStyledText(text: string): string {
  if (!text) return "";
  let parsed = text.replace(
    /\*([^*]+)\*/g,
    '<span class="text-primary-600">$1</span>',
  );
  parsed = parsed.replace(/<br\s*\/?>/gi, "<br />");
  parsed = parsed.replace(/\n/g, "<br />");
  return parsed;
}

export function HeroSection() {
  const { data: paqueteData, loading } = usePaqueteData();

  // ✅ Mostrar skeleton mientras carga
  if (loading) {
    return (
      <section className="relative overflow-hidden bg-neutral-900 min-h-screen md:h-screen flex items-center">
        <div className="absolute inset-0 bg-neutral-800 animate-pulse">
          <div className="absolute inset-0 bg-linear-to-r from-primary-950/85 via-primary-900/60 to-primary-900/40" />
        </div>
        <div className="relative w-full mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:py-32 flex flex-col items-center justify-center">
          <div className="mx-auto max-w-2xl md:max-w-3xl text-center text-white space-y-4 md:space-y-6">
            <div className="h-16 md:h-24 bg-white/10 rounded-lg w-full max-w-2xl mx-auto animate-pulse" />
            <div className="h-8 md:h-12 bg-white/10 rounded-lg w-full max-w-xl mx-auto animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden min-h-screen md:h-screen flex items-center shadow-md! bg-black! rounded-lg! p-2!">
      <div className="absolute inset-0">
        <Image
          src={
            paqueteData?.imagen ||
            "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=1800&h=900&fit=crop"
          }
          alt="Paquetes internacionales"
          fill
          className="object-cover transition-opacity duration-500"
          priority
          onError={(e) => {
            // ✅ Si la imagen falla, usar fallback en el DOM
            const img = e.target as HTMLImageElement;
            img.src =
              "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=1800&h=900&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary-950/85 via-primary-900/60 to-primary-900/40 md:from-primary-950/80" />
      </div>

      <div className="relative w-full mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:py-32 flex flex-col items-center justify-center">
        <div className="mx-auto max-w-2xl md:max-w-3xl text-center text-white! space-y-4 md:space-y-6">
          <h1
            className="text-4xl! font-bold! leading-tight! sm:text-4xl! md:text-6xl! lg:text-6xl! xl:text-7xl! shadow-lg! text-white!"
            dangerouslySetInnerHTML={{
              __html: parseStyledText(paqueteData?.heroTitulo || ""),
            }}
          />
          <p
            className="mx-auto text-md! sm:text-lg! md:text-xl! lg:text-xl! xl:text-2xl! leading-relaxed! text-neutral-100! px-2"
            dangerouslySetInnerHTML={{
              __html: parseStyledText(paqueteData?.heroSubtitulo || ""),
            }}
          />
        </div>
      </div>
    </section>
  );
}
