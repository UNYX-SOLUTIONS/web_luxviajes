// Servicio para obtener servicios
import { Service } from '@/types';

export const mockServices: Service[] = [
  {
    id: '1',
    title: 'Vuelos Internacionales',
    description: 'Conexiones a más de 500 destinos mundiales con las mejores aerolíneas',
    icon: '✈️',
  },
  {
    id: '2',
    title: 'Hoteles Exclusivos',
    description: 'Alojamiento en los mejores hoteles 5 estrellas del mundo',
    icon: '🏨',
  },
  {
    id: '3',
    title: 'Paquetes Personalizados',
    description: 'Diseñamos el viaje perfecto según tus preferencias y presupuesto',
    icon: '🎯',
  },
  {
    id: '4',
    title: 'Asesoramiento de Visas',
    description: 'Gestión completa de documentación y trámites de visado',
    icon: '📋',
  },
  {
    id: '5',
    title: 'Seguro de Viaje',
    description: 'Protección integral para tus viajes con coberturas completas',
    icon: '🛡️',
  },
  {
    id: '6',
    title: 'Soporte 24/7',
    description: 'Atención al cliente disponible en cualquier momento de tu viaje',
    icon: '💬',
  },
];

export async function getServices(): Promise<Service[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockServices;
}

// Re-exportar funciones de otros servicios
export { getDestinations, mockDestinations } from './destinations';
export { getPackages, mockPackages } from './packages';
