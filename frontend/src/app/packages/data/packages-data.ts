export interface BasePackage {
  id: string;
  title: string;
  image: string;
  description: string;
  duration: string;
  included: string[]; // Para mostrar en las cards (desde descripcion)
  detailIncluded?: string[]; // Para mostrar en el diálogo de detalles (desde descripcionDetallada)
  price?: string;
  pdf?: string; // URL del PDF
}

export interface PremiumPackage extends BasePackage {
  tag: string;
  days: string;
  highlights: string[];
  price: string;
  season: string;
}

export interface DreamDestination extends BasePackage {
  nights: string;
  season: string;
}

export const themeParks = [
  {
    title: "Disney y Universal",
    subtitle: "Orlando Experience",
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&h=600&fit=crop",
  },
  {
    title: "Europa Parks",
    subtitle: "Aventura Familiar",
    image:
      "https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=900&h=600&fit=crop",
  },
  {
    title: "Tokyo Adventure",
    subtitle: "Parques en Japon",
    image:
      "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?w=900&h=600&fit=crop",
  },
];
