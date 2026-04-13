'use client';

import Image from 'next/image';
import { Button } from '../common/Button';
import { cn } from '@/utils/cn';

interface Promotion {
  id: string;
  title: string;
  destination: string;
  image: string;
  badge?: string;
  link?: string;
}

interface PromotionsMapProps {
  className?: string;
}

const promotions: Promotion[] = [
  {
    id: '1',
    title: 'Medellín',
    destination: 'Panamá',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    badge: 'PROMO FLASH',
  },
  {
    id: '2',
    title: 'Colombia',
    destination: 'Sudamérica',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&h=300&fit=crop',
  },
  {
    id: '3',
    title: 'Panamá',
    destination: 'Centroamérica',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=300&fit=crop',
  },
  {
    id: '4',
    title: 'Brasil',
    destination: 'Sudamérica',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=300&fit=crop',
  },
];

export function PromotionsMap({ className }: PromotionsMapProps) {
  return (
    <section className={cn('py-16 md:py-24 bg-gradient-to-b from-white to-gray-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Top Promociones del Mes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cada detalle es realizado por expertos para asegurar que tu única preocupación sea disfrutar del horizonte
          </p>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-auto">
          {/* Map Image - Background */}
          <div className="relative w-full aspect-video md:aspect-auto md:h-[500px]">
            <Image
              src="/images/mapa.png"
              alt="Mapa de destinos"
              fill
              className="object-cover rounded-2xl shadow-2xl"
              priority
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />

            {/* Promotions Overlays */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              {/* Promo Flash Card - Top Left */}
              <div className="absolute top-8 left-8 md:top-12 md:left-12 z-20">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-xs hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                  {/* Badge */}
                  <div className="relative h-32 md:h-40 overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800">
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      PROMO FLASH
                    </div>
                    <Image
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop"
                      alt="Medellín Panamá"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">MEDELLÍN</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Vuelos • Hospedaje • Traslados • Tours<br />
                      <span className="font-semibold">🎁 Todo Incluido</span>
                    </p>
                    <Button size="sm" className="w-full justify-center">
                      Ver más →
                    </Button>
                  </div>
                </div>
              </div>

              {/* Location Pins - Panamá */}
              <div className="absolute bottom-20 left-1/4 z-10">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-125 transition-transform">
                    <span className="text-white text-xs md:text-sm">P</span>
                  </div>
                  <div className="text-white text-xs md:text-sm font-semibold mt-2 bg-black/50 px-2 py-1 rounded whitespace-nowrap">
                    Panamá
                  </div>
                </div>
              </div>

              {/* Location Pins - Colombia */}
              <div className="absolute bottom-24 left-1/3 z-10">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-125 transition-transform">
                    <span className="text-white text-xs md:text-sm">C</span>
                  </div>
                  <div className="text-white text-xs md:text-sm font-semibold mt-2 bg-black/50 px-2 py-1 rounded whitespace-nowrap">
                    Colombia
                  </div>
                </div>
              </div>

              {/* Location Pins - Brasil */}
              <div className="absolute bottom-32 left-2/5 z-10">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-125 transition-transform">
                    <span className="text-white text-xs md:text-sm">B</span>
                  </div>
                  <div className="text-white text-xs md:text-sm font-semibold mt-2 bg-black/50 px-2 py-1 rounded whitespace-nowrap">
                    Brasil
                  </div>
                </div>
              </div>

              {/* Location Pins - Asia */}
              <div className="absolute top-1/3 right-1/4 z-10">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-125 transition-transform">
                    <span className="text-white text-xs md:text-sm">A</span>
                  </div>
                  <div className="text-white text-xs md:text-sm font-semibold mt-2 bg-black/50 px-2 py-1 rounded whitespace-nowrap">
                    Asia
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Text */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Haz clic en los pines para explorar más promociones</p>
          </div>
        </div>
      </div>
    </section>
  );
}
