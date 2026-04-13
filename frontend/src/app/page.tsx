'use client';

import { Hero, Button } from '@/components/common';
import { DestinationCard, PackageCard, ServiceCard, StatsSection, PromotionsMap, ServicesDetailSection } from '@/components/sections';
import { getDestinations, getPackages, getServices } from '@/services';
import { useEffect, useState } from 'react';
import { Destination, Package, Service } from '@/types';

export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    // Cargar datos
    Promise.all([getDestinations(), getPackages(), getServices()]).then(
      ([dest, pkg, serv]) => {
        setDestinations(dest);
        setPackages(pkg);
        setServices(serv);
      }
    );
  }, []);

  return (
    <>
      {/* Hero Section */}
      <Hero
        title="MALDIVAS"
        subtitle="Un amanecer sereno en villas sobre el agua turquesa"
        backgroundImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop"
        ctaText="Explorar"
        ctaHref="#destinations"
      />

      {/* Promotions Map Section */}
      <PromotionsMap />

      {/* Services Detail Section */}
      <ServicesDetailSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Featured Destinations Section */}
      <section id="destinations" className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Destinos Populares</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre nuestros destinos más solicitados con experiencias inolvidables
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button className="px-8 py-3">Ver todos los destinos</Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-20 bg-linear-to-b from-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ofrecemos soluciones integrales para todos tus necesidades de viaje
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Paquetes Internacionales</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Elige el paquete perfecto para tu próxima aventura
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button className="px-8 py-3">Explorar más paquetes</Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-linear-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para tu próxima aventura?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Contáctanos hoy y déjanos crear la experiencia de viaje perfecta para ti
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Contactar Ahora
            </Button>
            <a
              href="https://wa.me/593984220600"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 w-full">
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
