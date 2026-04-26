"use client";

import Image from "next/image";
import { usePaqueteData } from "@/hooks";

function parseStyledText(text: string): string {
  let parsed = text.replace(/\*([^*]+)\*/g, '<span class="text-primary-600">$1</span>');
  parsed = parsed.replace(/<br\s*\/?>/gi, '<br />');
  parsed = parsed.replace(/\n/g, '<br />');
  return parsed;
}

export function HeroSection() {
  const { data: paqueteData } = usePaqueteData();

  return (
    <section className="relative overflow-hidden bg-neutral-900 h-screen">
      <div className="absolute inset-0">
        <Image
          src={paqueteData?.imagen || "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=1800&h=900&fit=crop"}
          alt="Paquetes internacionales"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary-950/80 via-primary-900/45 to-primary-900/25" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-14 py-24 sm:px-6 lg:px-8 lg:pb-20 lg:py-32 flex flex-col items-center justify-center h-full">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h1 
            className="text-4xl font-extrabold md:text-6xl"
            dangerouslySetInnerHTML={{
              __html: parseStyledText(paqueteData?.heroTitulo || "")
            }}
          />
          <p 
            className="mx-auto mt-4 max-w-xl text-base text-white! md:text-lg lg:text-xl"
            dangerouslySetInnerHTML={{
              __html: parseStyledText(paqueteData?.heroSubtitulo || "")
            }}
          />
        </div>
      </div>
    </section>
  );
}
