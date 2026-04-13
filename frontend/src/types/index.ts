// Types para la aplicación Lux Viajes

export interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  duration: number; // en días
  rating: number;
  reviews: number;
}

export interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  duration: number;
  includes: string[];
  difficulty?: 'easy' | 'moderate' | 'hard';
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
}

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface StatCard {
  label: string;
  value: string;
  icon?: string;
}
