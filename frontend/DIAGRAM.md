```
┌─────────────────────────────────────────────────────────────────┐
│                  LUX VIAJES - ARQUITECTURA FRONTEND             │
│                    Next.js 16 + React 19 + TypeScript           │
└─────────────────────────────────────────────────────────────────┘

📁 ESTRUCTURA DEL PROYECTO
═════════════════════════════════════════════════════════════════

src/
│
├── 📁 app/
│   ├── layout.tsx         → Layout principal (Header + Footer)
│   ├── page.tsx           → Home Page con todas las secciones
│   └── globals.css        → Estilos globales + variables CSS
│
├── 📁 components/
│   ├── 📁 common/         → Componentes reutilizables (reusables)
│   │   ├── Button.tsx     → Componente botón con variantes
│   │   ├── Card.tsx       → Contenedor Card flexible
│   │   ├── Header.tsx     → Navegación principal sticky
│   │   ├── Footer.tsx     → Pie de página con links
│   │   ├── Hero.tsx       → Banner hero con imagen y CTA
│   │   ├── StatCard.tsx   → Tarjeta de estadística
│   │   └── index.ts       → Barrel export
│   │
│   └── 📁 sections/       → Componentes de secciones específicas
│       ├── DestinationCard.tsx  → Tarjeta de destino
│       ├── PackageCard.tsx      → Tarjeta de paquete
│       ├── ServiceCard.tsx      → Tarjeta de servicio
│       ├── StatsSection.tsx     → Sección de estadísticas
│       └── index.ts             → Barrel export
│
├── 📁 services/
│   ├── destinations.ts    → Funciones para obtener destinos
│   ├── packages.ts        → Funciones para obtener paquetes
│   └── index.ts           → Re-exporta todas las funciones
│
├── 📁 types/
│   └── index.ts           → Tipos TypeScript (Destination, Package, Service)
│
├── 📁 utils/
│   ├── cn.ts             → Función para combinar clases Tailwind
│   ├── formatting.ts     → Formateo (precios, fechas, textos)
│   └── index.ts
│
├── 📁 hooks/
│   ├── useScrollPosition.ts → Hook para tracking de scroll
│   └── index.ts
│
└── 📁 constants/
    └── index.ts          → Constantes de la app (COMPANY_INFO, NAVIGATION, etc)


🎨 COMPONENTES PRINCIPALES
═════════════════════════════════════════════════════════════════

🟣 Common Components (Reutilizables)
├── Button        - Variantes: primary, secondary, outline, ghost
├── Card          - Composable: CardHeader, CardBody, CardFooter
├── Header        - Navegación sticky con logo y CTA
├── Footer        - Links, contacto, redes sociales
├── Hero          - Banner con imagen de fondo
└── StatCard      - Tarjeta de estadística


🟢 Section Components (Específicos)
├── DestinationCard   - Muestra destino individual
├── PackageCard       - Muestra paquete con detalles
├── ServiceCard       - Muestra servicio con icono
└── StatsSection      - Sección con 4 estadísticas


📄 PÁGINA HOME - SECCIONES
═════════════════════════════════════════════════════════════════

1. HERO SECTION
   └─ Banner con imagen (Maldivas)
      ├─ Título principal
      ├─ Subtítulo
      └─ CTA "Explorar"

2. STATS SECTION
   └─ 4 Estadísticas en grid:
      ├─ 10M+ Clientes Frecuentes
      ├─ 07+ Años de experiencia
      ├─ 1K Destinos
      └─ 5.0 Valoración

3. DESTINATIONS SECTION
   └─ Grid 4 columnas (responsive):
      ├─ Tarjetas de destinos populares
      └─ Botón "Ver todos los destinos"

4. SERVICES SECTION (Fondo gradiente)
   └─ Grid 3 columnas:
      ├─ 6 tarjetas de servicios
      └─ Cada una con icono + título + descripción

5. PACKAGES SECTION
   └─ Grid 3 columnas:
      ├─ 3 paquetes destacados
      └─ Botón "Explorar más paquetes"

6. CTA FINAL SECTION (Gradiente purple-blue)
   └─ Contenedor centrado:
      ├─ Título: "¿Listo para tu próxima aventura?"
      ├─ Descripción
      └─ Botones de ContactoWhatsApp


🛠️ DESARROLLO Y COMANDOS
═════════════════════════════════════════════════════════════════

# Instalación
cd frontend
pnpm install

# Desarrollo (puerto 3000)
pnpm dev

# Build producción
pnpm build
pnpm start

# Linting
pnpm lint

# Type checking
pnpm exec tsc --noEmit


📦 STACK TECNOLÓGICO
═════════════════════════════════════════════════════════════════

✅ Next.js 16.2.3        - Framework React moderno
✅ React 19.2.4          - Librería de componentes
✅ TypeScript 5.9        - Tipado fuerte
✅ Tailwind CSS 4        - Estilos utilitarios
✅ pnpm 10.28.2          - Gestor de paquetes
✅ ESLint 9              - Linting de código


🎯 CARACTERÍSTICAS
═════════════════════════════════════════════════════════════════

✅ Home page completa con imagen hero
✅ Componentes reutilizables y bien tipados
✅ Responsive design (mobile, tablet, desktop)
✅ Navegación profesional con sticky header
✅ Footer con secciones y redes sociales
✅ Estadísticas de empresa
✅ Galería de destinos
✅ Galería de servicios
✅ Galería de paquetes
✅ CTA (Call-to-action) integrado
✅ WhatsApp integrado
✅ TypeScript strict mode
✅ Image optimization configurada
✅ Security headers configurados


📚 PATRONES UTILIZADOS
═════════════════════════════════════════════════════════════════

✅ Barrel Exports     - index.ts en cada carpeta
✅ Path Aliases       - @/* → src/
✅ Component Props    - Tipadas con interfaces
✅ Client Components  - 'use client' donde sea necesario
✅ Composition        - Componentes componibles
✅ Separation Concern - Cada cosa en su lugar


🚀 PRÓXIMAS MEJORAS
═════════════════════════════════════════════════════════════════

[ ] Página About/Nosotros
[ ] Página de Destinos detallada
[ ] Página de Servicios detallada
[ ] Página de Visas y requisitos
[ ] Formulario de contacto con validación
[ ] Sistema de búsqueda y filtros
[ ] Carrito de compras
[ ] Sistema de pagos (Stripe/PayPal)
[ ] Autenticación de usuarios
[ ] Panel de administración
[ ] Blog de viajes
[ ] Galería de fotos
[ ] Testimonios de clientes
[ ] API Backend integrada
[ ] Database (PostgreSQL)
[ ] Deployment (Vercel/Docker)


✨ NOTAS IMPORTANTES
═════════════════════════════════════════════════════════════════

• El proyecto usa Next.js App Router (no Pages Router)
• Tailwind CSS v4 con @tailwindcss/postcss
• Componentes sin estado usando useState donde necesario
• Datos mockup listos para API real
• Optimizado para SEO (Metadata, Open Graph)
• Headers de seguridad configurados
• Image optimization ya incluida
```