# ✈️ Luxviajes - Frontend

Aplicación web moderna para la agencia de viajes **Luxviajes**. Construida con Next.js 16, React 19, TypeScript y Tailwind CSS.

## 🚀 Inicio Rápido

```bash
# 1. Entrar a la carpeta
cd frontend

# 2. Instalar dependencias
pnpm install

# 3. Iniciar servidor de desarrollo
pnpm dev

# 4. Abrir http://localhost:3000 en tu navegador
```

## 📚 Documentación

La documentación completa está organizada en varios archivos:

- **[INDEX.md](./INDEX.md)** - Índice completo de documentación 📚
- **[QUICK_START.md](./QUICK_START.md)** - Guía rápida para desarrolladores ⚡
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Estructura y patrones utilizados 🏗️
- **[DIAGRAM.md](./DIAGRAM.md)** - Diagrama visual del proyecto 📊
- **[SUMMARY.md](./SUMMARY.md)** - Resumen de lo implementado ✅

**⭐ Recomendación:** Comienza leyendo [INDEX.md](./INDEX.md)

## 🎯 Stack Tecnológico

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Next.js** | 16.2.3 | Framework React con SSR/SSG |
| **React** | 19.2.4 | Librería de componentes |
| **TypeScript** | 5.9.3 | Tipado fuerte |
| **Tailwind CSS** | 4.2.2 | Estilos utilitarios |
| **pnpm** | 10.28.2 | Gestor de paquetes rápido |
| **ESLint** | 9.39.4 | Linting y análisis |

## ✨ Características

### ✅ Página Home Completa

- **Hero Section** - Banner con CTA
- **Estadísticas** - Números de empresa
- **Destinos Populares** - Galería de 4 destinos
- **Servicios** - 6 servicios disponibles
- **Paquetes Internacionales** - 3 paquetes destacados
- **CTA Final** - Llamada a contacto

### ✅ Componentes Profesionales

- **Button** - 4 variantes (primary, secondary, outline, ghost)
- **Card** - Composable con partes (Header, Body, Footer)
- **Header** - Navegación sticky responsive
- **Footer** - Links, contacto, redes sociales
- **Hero** - Banner con imagen personalizable
- **StatCard** - Tarjeta de estadísticas

### ✅ Arquitectura Modular

```
src/
├── components/     → Componentes UI
├── services/       → Lógica de datos
├── types/          → Tipos TypeScript
├── utils/          → Funciones auxiliares
├── hooks/          → Hooks personalizados
└── constants/      → Constantes de aplicación
```

## 📝 Comandos Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia servidor en puerto 3000

# Producción
pnpm build        # Crea build optimizado
pnpm start        # Inicia servidor en producción

# Calidad
pnpm lint                # Verifica ESLint
pnpm exec tsc --noEmit  # Verifica TypeScript
```

## 🎨 Personalización

### Cambiar colores
Edita `src/app/globals.css` o `tailwind.config.ts`

### Cambiar contenido de la Home
Edita `src/app/page.tsx`

### Cambiar información de empresa
Edita `src/constants/index.ts` (COMPANY_INFO)

### Agregar nuevos destinos/paquetes
Edita los archivos en `src/services/`

## 🔧 Configuración

### Variables de Entorno
Copia `.env.example` a `.env.local` y completa los valores:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_PHONE=+593 98 422 0600
NEXT_PUBLIC_WHATSAPP=+593 98 422 0600
NEXT_PUBLIC_EMAIL=info@luxviajes.com
```

## 📱 Responsive Design

El proyecto es completamente responsive:

- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Ultra Desktop (2560px+)

## 🔐 Seguridad

- ✅ Security headers configurados
- ✅ TypeScript strict mode
- ✅ Sin vulnerabilidades XSS
- ✅ CORS bien configurado

## ⚡ Performance

- ✅ Image optimization automática
- ✅ Code splitting
- ✅ Static generation
- ✅ CSS minimizado (Tailwind)

## 🤝 Contribuciones

Cuando contribuyas, sigue:

1. Las convenciones en [ARCHITECTURE.md](./ARCHITECTURE.md)
2. El tipo de cambio debe compilar sin errores (`pnpm build`)
3. No incluir `console.log` en producción
4. Mantener la estructura modular

## 📦 Próximas Mejoras

- [ ] Más páginas (About, Services, Contact, etc.)
- [ ] Integración API backend
- [ ] Sistema de búsqueda
- [ ] Carrito de compras
- [ ] Autenticación de usuarios
- [ ] Sistema de reservas
- [ ] Blog de viajes
- [ ] Testimonios

## 📞 Contacto

**Luxviajes - Agencia de Viajes Premium**

- 📞 Teléfono: +593 98 422 0600
- 💬 WhatsApp: +593 98 422 0600
- ✉️ Email: info@luxviajes.com

## 📄 Licencia

Proyecto privado de Luxviajes. Todos los derechos reservados.

---

**Creado con ❤️ usando Next.js, React y TypeScript**

**Última actualización:** 13 de abril de 2026  
**Stack:** Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
