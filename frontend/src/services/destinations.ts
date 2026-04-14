// Servicio para obtener datos de destinos
import { Destination } from '@/types';

// Datos mockup - en producción vendrían de una API
export const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Maldivas',
    description: 'Un amanecer sereno en villas sobre el agua turquesa',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    price: 2499,
    duration: 7,
    rating: 5.0,
    reviews: 340,
  },
  {
    id: '2',
    name: 'París',
    description: 'La ciudad del amor y la arquitectura romántica',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop',
    price: 1999,
    duration: 5,
    rating: 4.8,
    reviews: 280,
  },
  {
    id: '3',
    name: 'Tailandia',
    description: 'Templos antiguos y playas tropicales espectaculares',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    price: 1599,
    duration: 10,
    rating: 4.9,
    reviews: 450,
  },
  {
    id: '4',
    name: 'Nueva York',
    description: 'La ciudad que nunca duerme, llena de rascacielos y vida',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop',
    price: 2099,
    duration: 6,
    rating: 4.7,
    reviews: 520,
  },
];

export async function getDestinations(): Promise<Destination[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockDestinations;
}

export async function getDestinationById(id: string): Promise<Destination | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockDestinations.find((d) => d.id === id);
}
