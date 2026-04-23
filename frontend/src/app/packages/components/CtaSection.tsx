import { PhoneIcon } from "@heroicons/react/24/solid";
import type { FC } from "react";
import Image from "next/image";

interface CtaSectionProps {
  onContactClick: () => void;
}

export const CtaSection: FC<CtaSectionProps> = ({ onContactClick }) => {
  return (
    <section className="bg-neutral-50 pb-16 md:pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary-800 to-primary-700 px-8 py-12 text-white shadow-xl">
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <Image
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=500&fit=crop"
              alt="Paquetes internacionales"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-5xl font-bold leading-none">
                ¿Listo para cruzar fronteras?
              </h3>
              <p className="mt-4 max-w-2xl text-white!">
                Nuestros asesores expertos estan listos para disenar el viaje de
                tus suenos. Consultoria personalizada y sin compromiso.
              </p>
            </div>
            <button
              onClick={onContactClick}
              className="inline-flex rounded-full bg-primary-50 px-3 py-3 text-sm font-semibold text-primary-800! transition hover:bg-primary-50 gap-2 items-center"
            >
              <PhoneIcon className="h-5 w-5 inline-block" />
              <p className="text-sm font-semibold text-primary-800!">
                Contactar a un Asesor
              </p>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
