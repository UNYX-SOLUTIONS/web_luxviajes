export type NavLink = {
  label: string;
  href: string;
};

export type ServiceItem = {
  title: string;
  description: string;
};

export type PackageItem = {
  name: string;
  duration: string;
  highlight: string;
  summary: string;
};

export type OfficeItem = {
  city: string;
  address: string;
};

export const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services/' },
  { label: 'Packages', href: '/packages/' },
  { label: 'About Us', href: '/about-us/' }
];

export const services: ServiceItem[] = [
  {
    title: 'Boletos Aereos',
    description: 'Comparacion de rutas, aerolineas y ventanas de precio para optimizar tu viaje.'
  },
  {
    title: 'Paquetes Turisticos',
    description: 'Itinerarios listos o personalizados con hoteles, traslados y actividades.'
  },
  {
    title: 'Solicitud de Visas',
    description: 'Asesoria integral para requisitos, formularios y preparacion de entrevista.'
  },
  {
    title: 'Cruceros',
    description: 'Curaduria de salidas premium para experiencias de descanso y lujo.'
  },
  {
    title: 'Seguros de Viaje',
    description: 'Coberturas de asistencia medica, retrasos y cancelaciones con respaldo global.'
  },
  {
    title: 'Atencion al Cliente',
    description: 'Soporte humano por WhatsApp antes, durante y despues del viaje.'
  }
];

export const packages: PackageItem[] = [
  {
    name: 'Maldivas Signature',
    duration: '7 dias / 6 noches',
    highlight: 'Exclusive',
    summary: 'Villas sobre el agua y experiencias privadas frente al oceano.'
  },
  {
    name: 'Kyoto Premium',
    duration: '6 dias / 5 noches',
    highlight: 'Cultural',
    summary: 'Tradicion japonesa con hospedaje boutique y rutas curadas.'
  },
  {
    name: 'Venecia Romance',
    duration: '5 dias / 4 noches',
    highlight: 'Popular',
    summary: 'Canales iconicos, arte y gastronomia italiana en formato lujo.'
  },
  {
    name: 'Punta Cana All Inclusive',
    duration: '5 dias / 4 noches',
    highlight: 'Top ventas',
    summary: 'Resort premium, vuelos y traslados incluidos desde Ecuador.'
  }
];

export const offices: OfficeItem[] = [
  {
    city: 'Guayaquil',
    address:
      'Via Daule-Samborondon, diagonal al C.C. El Dorado, Ciudad Millenium, Edif. Platinum II piso 5 oficina 512.'
  },
  {
    city: 'Quito',
    address: 'Shyris y Suecia, Edif. Renazzo, piso 3, oficina 301.'
  },
  {
    city: 'Cuenca',
    address: 'Atencion personalizada en oficina bajo cita previa.'
  }
];

export const whatsappUrl = 'https://wa.me/593964220600';
export const contactEmail = 'luxviajes.ec@gmail.com';
