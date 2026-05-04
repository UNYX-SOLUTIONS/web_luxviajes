# Luxviajes - Frontend

Proyecto Next.js profesional para la agencia de viajes Luxviajes.

## Stack Tecnológico

- **Next.js 16.2** - Framework React con SSR/SSG
- **React 19** - Librería UI
- **TypeScript 5.9** - Tipado fuerte
- **Tailwind CSS 4** - Estilos utilitarios
- **pnpm** - Gestor de paquetes rápido

## Estructura del Proyecto

```
src/
├── app/                    # App Router (páginas y layouts)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página Home
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── common/            # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── StatCard.tsx
│   │   └── index.ts       # Barrel export
│   └── sections/          # Componentes de secciones específicas
│       ├── DestinationCard.tsx
│       ├── PackageCard.tsx
│       ├── ServiceCard.tsx
│       ├── StatsSection.tsx
│       └── index.ts       # Barrel export
├── hooks/                 # Custom hooks
│   ├── useScrollPosition.ts
│   └── index.ts
├── services/              # Servicios (API calls, data fetching)
│   ├── destinations.ts
│   ├── packages.ts
│   └── index.ts
├── types/                 # Definiciones de tipos TypeScript
│   └── index.ts
├── utils/                 # Funciones utilitarias
│   ├── cn.ts              # Utilidad para combinar clases
│   ├── formatting.ts      # Funciones de formateo
│   └── index.ts
└── constants/             # Constantes de la aplicación
    └── index.ts

public/                    # Archivos estáticos
```

## Arquitectura y Patrones

### 1. **Barrel Exports**
Todos los directorios tienen un archivo `index.ts` que actúa como punto de entrada central, facilitando las importaciones:

```typescript
// En lugar de:
import { Button } from '@/components/common/Button'

// Hacemos:
import { Button } from '@/components/common'
```

### 2. **Path Aliases**
Configurados en `tsconfig.json` para importaciones limpias:
- `@/*` → apunta a `src/`

### 3. **Separación de Responsabilidades**

- **Components**: Componentes UI puros (presentacionales)
- **Services**: Lógica de obtención de datos
- **Hooks**: Lógica reutilizable comportamental
- **Utils**: Funciones auxiliares puras
- **Types**: Definiciones de tipos compartidas
- **Constants**: Valores constantes de la app

### 4. **Componentes Reutilizables**

Todos los componentes siguen patrones profesionales:
- Props bien tipadas
- Composición flexible
- Estilos consistentes con Tailwind
- Accesibilidad considerada

### 5. **Gestión de Estado y Datos**

- Estado local con `useState`
- Datos mockup en servicios (convertibles a API real)
- Manejo de loading/error preparado para futuras APIs

## Desarrollo

### Instalación

```bash
cd frontend
pnpm install
```

### Ejecución en desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000)

### Build para producción

```bash
pnpm build
pnpm start
```

### Linting

```bash
pnpm lint
```

## Características Implementadas

### ✅ Home Page
- Hero section con CTA
- Estadísticas de empresa
- Destinos populares
- Servicios ofrecidos
- Paquetes internacionales
- CTA final con contacto

### ✅ Header/Navegación
- Logo con branding
- Navegación responsive
- Botón WhatsApp
- Sticky header

### ✅ Footer
- Links de navegación
- Contacto (teléfono, WhatsApp, email)
- Redes sociales
- Copyright

## Próximas Mejoras

- [ ] Página de destinos individual
- [ ] Página de paquetes con filtros
- [ ] Sistema de reservas
- [ ] Blog de viajes
- [ ] Galería de fotos
- [ ] Testimonios
- [ ] Formulario de contacto
- [ ] API real de backend
- [ ] Autenticación de usuario
- [ ] Carrito de compras
- [ ] Pagos integrados
- [ ] SEO optimizado

## Convenciones de Código

### Nombres de Archivos
- Componentes: `PascalCase.tsx` (ej: `Button.tsx`)
- Hooks: `camelCase.ts` (ej: `useScrollPosition.ts`)
- Utils/Services: `camelCase.ts` (ej: `formatting.ts`)

### Componentes Funcionales
- Usar componentes funcionales con TypeScript
- Marcar componentes interactivos con `'use client'`
- Exportar tipos de Props con interfaz `ComponentProps`

### Imports
```typescript
// Orden de imports:
// 1. React/Next
// 2. Librerías externas
// 3. Componentes
// 4. Types
// 5. Utils/Constants
```

## Performance

- ✅ Image Optimization de Next.js
- ✅ Code Splitting automático
- ✅ Static generation donde sea posible
- ✅ CSS minimizado (Tailwind)
- ✅ Headers de seguridad configurados

## Seguridad

- ✅ CORS headers
- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ Validación de tipos con TypeScript
- ✅ Componentes sin XSS

## Recursos

- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación React](https://react.dev)
- [Documentación Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org)

## Contribución

Este proyecto sigue estándares profesionales. Al agregar nuevas características:

1. Mantén la estructura modular
2. Crea tipos específicos
3. Usa barrel exports
4. Documenta cambios significativos
5. Asegura TypeScript strict mode
