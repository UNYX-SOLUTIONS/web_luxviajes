// Servicio para obtener paquetes
import { Package } from '@/types';

export const mockPackages: Package[] = [
  {
    id: '1',
    title: 'Caribbean Paradise',
    description: 'Vacaciones relajantes en las mejores playas del Caribe',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
    duration: 7,
    difficulty: 'easy',
    includes: [
      'Hotel 5 estrellas',
      'Todo incluido',
      'Actividades acuáticas',
      'Transporte',
    ],
  },
  {
    id: '2',
    title: 'European Adventure',
    description: 'Recorre los principales destinos de Europa en 10 días',
    price: 2799,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop',
    duration: 10,
    difficulty: 'moderate',
    includes: [
      'Vuelos incluidos',
      'Hotel 4 estrellas',
      'Tours guiados',
      'Guía turístico',
    ],
  },
  {
    id: '3',
    title: 'Asia Explorer',
    description: 'Experiencia aventurera por los templos y playas de Asia',
    price: 1699,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop',
    duration: 14,
    difficulty: 'hard',
    includes: [
      'Avión + Hotel',
      'Comidas locales',
      'Senderismo',
      'Inmersión cultural',
    ],
  },
];

export async function getPackages(): Promise<Package[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockPackages;
}
