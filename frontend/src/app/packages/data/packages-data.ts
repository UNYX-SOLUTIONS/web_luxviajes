export interface BasePackage {
  title: string;
  image: string;
  description: string;
  duration: string;
  included: string[];
  price?: string;
}

export interface PremiumPackage extends BasePackage {
  tag: string;
  days: string;
  highlights: string[];
  price: string;
}

export interface DreamDestination extends BasePackage {
  nights: string;
  season: string;
}

export const premiumPackages: PremiumPackage[] = [
  {
    tag: "Seleccion del concierge",
    title: "Europa Majica",
    days: "12 Dias",
    price: "4,250",
    image:
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=900&h=1200&fit=crop",
    description: "Un viaje extraordinario a través de los sitios más icónicos de Europa",
    duration: "12 días / 11 noches",
    highlights: [
      "París - Torre Eiffel y Louvre",
      "Amsterdam - Canales y museos",
      "Berlín - Historia y arquitectura moderna",
      "Viena - Palacios imperiales"
    ],
    included: [
      "✈ Vuelos internacionales y domésticos",
      "🏨 Alojamiento 4-5 estrellas",
      "🍽 Desayunos y 8 cenas",
      "🎫 Entradas a principales atracciones",
      "🚌 Transporte y tours guiados",
      "🛡 Seguro de viaje completo"
    ]
  },
  {
    tag: "Popular",
    title: "Duqai Exclusivo",
    days: "8 Dias",
    price: "5,800",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&h=1200&fit=crop",
    description: "Lujo y modernidad en el corazón del Golfo Pérsico",
    duration: "8 días / 7 noches",
    highlights: [
      "Burj Khalifa - Torre más alta del mundo",
      "Desierto de Dubái",
      "Palm Jumeirah",
      "Compras en Dubai Mall"
    ],
    included: [
      "✈ Vuelos internacionales",
      "🏨 Resort 5 estrellas con playa",
      "🍽 Buffet ilimitado",
      "🎫 Tours y actividades premium",
      "🚗 Transporte privado",
      "🛡 Seguro de viaje"
    ]
  },
  {
    tag: "Todo Incluido",
    title: "Cariqe All-Inclusive",
    days: "10 Dias",
    price: "2,900",
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&h=1200&fit=crop",
    description: "Playas paradisíacas del Caribe con todo incluido",
    duration: "10 días / 9 noches",
    highlights: [
      "Playas de Cancún",
      "Arrecifes de coral",
      "Isla Mujeres",
      "Cenotes mayas"
    ],
    included: [
      "✈ Vuelos internacionales",
      "🏨 Resort all-inclusive 5 estrellas",
      "🍽 Todas las comidas y bebidas",
      "🏖 Playas de arena blanca",
      "🎯 Actividades acuáticas",
      "🛡 Seguro de viaje"
    ]
  },
  {
    tag: "Seleccion del concierge",
    title: "Asia Ancestral",
    days: "15 Dias",
    price: "6,400",
    image:
      "https://images.unsplash.com/photo-1528164344705-47542687000d?w=900&h=1200&fit=crop",
    description: "Milenios de historia y cultura en un viaje transformador",
    duration: "15 días / 14 noches",
    highlights: [
      "Templos de Tailandia",
      "Grandes templos de Camboya",
      "Ho Chi Minh en Vietnam",
      "Crucero Halong Bay"
    ],
    included: [
      "✈ Vuelos internacionales",
      "🏨 Alojamiento boutique",
      "🍽 Comidas auténticas locales",
      "🎫 Tours con guías expertos",
      "🚢 Crucero incluido",
      "🛡 Seguro de viaje"
    ]
  },
];

export const dreamDestinations: DreamDestination[] = [
  {
    title: "Cartagena",
    nights: "4 dias, 3 noches (3era noche gratis)",
    season: "Disponible de Julio a Noviembre",
    image:
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=900&h=600&fit=crop",
    description: "La joya del Caribe colombiano con arquitectura colonial e historia viva",
    duration: "4 días / 3 noches",
    price: "1,250",
    included: [
      "✈ Vuelo aéreo",
      "🏨 Hotel 4 estrellas (3 noches)",
      "🍽 Desayunos incluidos",
      "🧭 Tours guiados por la ciudad",
      "🛡 Asistencia de viaje"
    ]
  },
  {
    title: "Panama Low Cost",
    nights: "4 dias, 3 noches",
    season: "Disponible de Julio a Noviembre",
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=900&h=600&fit=crop",
    description: "Explora el Canal de Panamá y disfruta de playas sin gastar demasiado",
    duration: "4 días / 3 noches",
    price: "950",
    included: [
      "✈ Vuelo aéreo",
      "🏨 Hotel 3 estrellas",
      "🍽 Desayunos y cenas",
      "🚣 Tours por el canal",
      "🛡 Asistencia de viaje"
    ]
  },
  {
    title: "Medellin Full Pack",
    nights: "4 dias, 3 noches",
    season: "Disponible de Julio a Noviembre",
    image:
      "https://images.unsplash.com/photo-1536421469767-80559bb6f5e1?w=900&h=600&fit=crop",
    description: "Vive la transformación de Medellín con cultura, gastronomía y naturaleza",
    duration: "4 días / 3 noches",
    price: "1,150",
    included: [
      "✈ Vuelo aéreo",
      "🏨 Hotel 4 estrellas",
      "🍽 Comidas gastrómicas",
      "🧭 Free tour y comuna 13",
      "🛡 Asistencia de viaje"
    ]
  },
  {
    title: "Cartagena + Panama",
    nights: "7 dias, 6 noches",
    season: "Disponible de Julio a Noviembre",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&h=600&fit=crop",
    description: "Lo mejor de dos países: historia, playas y el icónico Canal de Panamá",
    duration: "7 días / 6 noches",
    price: "2,100",
    included: [
      "✈ Vuelos aéreos",
      "🏨 Hoteles 4 estrellas",
      "🍽 Desayunos, comidas y cenas",
      "🧭 Tours guiados completos",
      "🛡 Asistencia de viaje"
    ]
  },
];

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
