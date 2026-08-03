// Constantes de la aplicación

export const COMPANY_INFO = {
  name: "Luxviajes",
  tagline: "Agencia de Viajes Premium",
  description: "Experiencias de viaje inolvidables a destinos internacionales",
  // DEPRECATED: Use useRedSocial() hook para obtener datos actualizados desde Strapi
  phone: "+593 98 422 0600",
  whatsapp: "+593 98 422 0600",
  email: "info@luxviajes.com",
} as const;

export const NAVIGATION_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/about" },
  { label: "Servicios", href: "/services" },
  { label: "Paquetes Internacionales", href: "/packages" },
  { label: "Visas", href: "/visas" },
  { label: "Contáctanos", href: "/contact" },
  { label: "Trabaja con nosotros", href: "/help#trabaja-con-nosotros" },
  { label: "Ayuda", href: "/help" },
  { label: "Blog", href: "/blog" },
] as const;

export const STATS = [
  { label: "Clientes Frecuentes", value: "10M+" },
  { label: "Años de experiencia", value: "07+" },
  { label: "Destinos", value: "1K" },
  { label: "Valoración", value: "5.0" },
] as const;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://cms.agencialuxviajes.com/admin/api";

export const ROUTES = {
  home: "/",
  about: "/about",
  services: "/services",
  packages: "/packages",
  visas: "/visas",
  contact: "/contact",
  help: "/help",
  workWithUs: "/work-with-us",
  blog: "/blog",
} as const;

export const CACHE_DURATION = {
  SHORT: 60 * 1000, // 1 minuto
  MEDIUM: 60 * 60 * 1000, // 1 hora
  LONG: 24 * 60 * 60 * 1000, // 1 día
} as const;
