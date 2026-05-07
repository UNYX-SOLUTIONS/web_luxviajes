// Types para la aplicación Luxviajes

// Destino Soñado (Dream Destination)
export interface TopDestinosMes {
  id: number;
  documentId: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  disponibilidad: string;
  duracion: string;
  precio: string;
  descripcionDetallada: string;
  imagen?: string; // URL completa de la imagen
  pdf?: string; // URL completa del PDF
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Tarjeta de Servicio (Service Card)
export interface TarjetaServicio {
  id: number;
  documentId: string;
  titulo: string;
  subtitulo: string;
  imagen?: string; // URL completa de la imagen
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Visa
export interface Visa {
  id: number;
  documentId: string;
  titulo: string;
  subtitulo: string;
  validez: string;
  procesamiento: string;
  requisitos: string;
  imagen?: string;
  pdf?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Página de Visas
export interface VisasPage {
  heroTitulo: string;
  heroSubtitulo: string;
  seccionGeneralTitulo: string;
  seccionGeneralContenido: string;
  llamadaTitulo: string;
  llamadaSubtitulo: string;
  subscripcionTitulo: string;
  subscripcionSubtitulo: string;
  heroImagen?: string;
  visa_items: Visa[];
}

// Legacy interfaces (mantener por compatibilidad)
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
  difficulty?: "easy" | "moderate" | "hard";
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  order?: number;
  active?: boolean;
}

export interface RedSocial {
  id: number;
  documentId: string;
  llamada: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  email_trabajos: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface HomeStats {
  id: number;
  frequent_clients: string;
  years_experience: string;
  destinations: string;
  rating: string;
}

export interface StatCard {
  label: string;
  value: string;
}

export interface Home {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  banners: Banner[];
  redes?: RedSocial; // Objeto único con todas las redes sociales
  stats?: StatCard[] | null;
  destinos?: TopDestinosMes[];
  servicios?: TarjetaServicio[];
  serviciosTitulo?: string;
  serviciosDescripcion?: string;
  citaTitulo?: string;
  citaSubtitulo?: string;
  citaUrgencia?: string;
  llamadaTitulo?: string;
  llamadaSubtitulo?: string;
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

// About / Nosotros types
export interface Asesor {
  id: number;
  documentId: string;
  nombre: string;
  sede: string;
  imagen?: string; // URL completa de la imagen
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface About {
  id: number;
  documentId: string;
  heroTitulo?: string;
  heroSubtitulo?: string;
  heroImagen?: string; // URL completa de la imagen
  quienesSomosTitulo?: string;
  quienesSomosDescripcion?: string;
  numExpertos?: string;
  ciudades?: string;
  asesores?: Asesor[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Servicio types
export interface TarjetaServicioDetallada {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  imagen?: string; // URL completa de la imagen
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Testimonio {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  calificacion?: number;
  imagen?: string; // URL completa de la imagen
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Servicio {
  id: number;
  documentId: string;
  heroTitulo?: string;
  heroSubtitulo?: string;
  serviciosTitulo?: string;
  serviciosDescripcion?: string;
  imagen?: string; // URL completa de la imagen (para Hero)
  tarjeta_servicios?: TarjetaServicioDetallada[];
  testimonios?: Testimonio[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Paquete types
export interface PaquetePremium {
  id: number;
  documentId: string;
  etiqueta: string;
  dias: string;
  titulo: string;
  pdf?: string;
  descripcion: string;
  duracion: string;
  precio: string;
  imagen?: string; // URL completa de la imagen
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ParqueTematico {
  id: number;
  documentId: string;
  titulo: string;
  subtitulo?: string;
  imagen?: string; // URL completa de la imagen
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Paquete {
  id: number;
  documentId: string;
  heroTitulo?: string;
  heroSubtitulo?: string;
  llamadaTitulo?: string;
  llamadaSubtitulo?: string;
  boletinTitulo?: string;
  boletinDescripcion?: string;
  imagen?: string; // URL completa de la imagen (para Hero)
  topDestinosMes?: TopDestinosMes[]; // Reutilizamos la interfaz existente
  paquete_premiums?: PaquetePremium[];
  parquesTematicos?: ParqueTematico[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Contact / Contacto types
export interface Direccion {
  id: number;
  documentId: string;
  ciudad: string;
  direccion: string;
  url: string;
  imagen?: string; // URL completa de la imagen
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Contact {
  id: number;
  documentId: string;
  heroTitulo?: string;
  heroSubtitulo?: string;
  heroImagen?: string; // URL completa de la imagen
  direcciones?: Direccion[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Help / Ayuda types
export interface PreguntaFrecuente {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Help {
  id: number;
  documentId: string;
  pdfPoliticasAgencia?: string; // URL completa del PDF
  pdfPoliticasViaje?: string; // URL completa del PDF
  preguntasFrecuentes?: PreguntaFrecuente[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
