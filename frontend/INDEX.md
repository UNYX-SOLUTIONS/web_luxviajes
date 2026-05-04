# 📚 Índice de Documentación - Luxviajes Frontend

## 📖 Documentación Disponible

### 🚀 Para Empezar Rápido
- **[QUICK_START.md](./QUICK_START.md)** ⭐ 
  Guía rápida para inicia el desarrollo, agregar componentes, páginas, servicios.

### 🏗️ Arquitectura y Estructura
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** 📋
  Documentación completa sobre la estructura del proyecto, patrones utilizados, convenciones de código.

- **[DIAGRAM.md](./DIAGRAM.md)** 📊
  Diagrama visual ASCII de la arquitectura completa del proyecto.

- **[SUMMARY.md](./SUMMARY.md)** ✅
  Resumen ejecutivo de todo lo que fue creado, features incluidas, próximas mejoras.

### 📁 Estructura del Proyecto

```
frontend/
├── 📚 DOCUMENTACIÓN
│   ├── ARCHITECTURE.md      ← Documentación detallada
│   ├── DIAGRAM.md           ← Diagrama visual
│   ├── QUICK_START.md       ← Guía rápida
│   ├── SUMMARY.md           ← Resumen
│   ├── README.md            ← Descripción del proyecto
│   └── .env.example         ← Variables de entorno
│
├── src/
│   ├── app/                 ← Rutas y páginas
│   ├── components/          ← Componentes UI
│   ├── hooks/               ← Custom hooks
│   ├── services/            ← Servicios de datos
│   ├── types/               ← Tipos TypeScript
│   ├── utils/               ← Funciones utilitarias
│   └── constants/           ← Constantes de la app
│
├── public/                  ← Archivos estáticos
├── package.json             ← Dependencias
├── next.config.ts           ← Configuración Next.js
├── tailwind.config.ts       ← Configuración Tailwind
├── tsconfig.json            ← Configuración TypeScript
└── eslint.config.mjs        ← Configuración ESLint
```

## 🎯 Guías por Tarea

### 📝 Crear un Nuevo Componente

**Ver:** [QUICK_START.md - Agregar un Nuevo Componente](./QUICK_START.md#agregar-un-nuevo-componente)

Pasos:
1. Crear archivo en `src/components/common/` o `src/components/sections/`
2. Escribir componente con Props tipadas
3. Actualizar `index.ts` con barrel export
4. Usar en otros componentes

### 📄 Crear una Nueva Página

**Ver:** [QUICK_START.md - Agregar una Nueva Página](./QUICK_START.md#agregar-una-nueva-página)

Pasos:
1. Crear carpeta en `src/app/nueva-pagina/`
2. Crear archivo `page.tsx`
3. Automáticamente accesible en `/nueva-pagina`

### 🔄 Agregar un Servicio

**Ver:** [QUICK_START.md - Agregar un Nuevo Servicio](./QUICK_START.md#agregar-un-nuevo-servicio)

Pasos:
1. Crear archivo en `src/services/`
2. Definir tipos y funciones
3. Actualizar `src/services/index.ts`
4. Usar en componentes con `useEffect`

### 🎨 Agregar Estilos

**Ver:** [QUICK_START.md - Agregar Estilos Globales](./QUICK_START.md#agregar-estilos-globales)

Usa Tailwind CSS para estilos. Los estilos globales van en `src/app/globals.css`.

## 🛠️ Comandos Principales

```bash
# Desarrollo
pnpm dev              # Inicia servidor en porto 3000

# Producción
pnpm build            # Crea build optimizado
pnpm start            # Inicia servidor en producción

# Calidad
pnpm lint             # Verifica errores ESLint
pnpm exec tsc --noEmit  # Verifica errores TypeScript
```

## 📚 Convenciones de Código

**Ver:** [ARCHITECTURE.md - Convenciones de Código](./ARCHITECTURE.md#convenciones-de-código)

- **Archivos:** PascalCase para componentes, camelCase para utils
- **Props:** Siempre tipadas con interfaz
- **Imports:** React, Next, librerías, componentes, types, utils
- **Exports:** Usar barrel exports (index.ts)

## 🎨 Stack Tecnológico

- Next.js 16.2 - Framework React moderno
- React 19 - Librería de componentes
- TypeScript 5.9 - Tipado fuerte
- Tailwind CSS 4 - Estilos utilitarios
- pnpm - Gestor de paquetes
- ESLint 9 - Linting

**Ver:** [ARCHITECTURE.md - Stack Tecnológico](./ARCHITECTURE.md#stack-tecnológico)

## ❓ Preguntas Frecuentes

**P: ¿Cómo inicio el desarrollo?**
R: `cd frontend && pnpm install && pnpm dev`

**P: ¿Dónde pongo componentes nuevos?**
R: En `src/components/common/` (reutilizables) o `src/components/sections/` (específicos)

**P: ¿Cómo agrego una nueva página?**
R: Crea una carpeta en `src/app/` con un archivo `page.tsx`

**P: ¿Cómo conecto a una API?**
R: Crea servicios en `src/services/` y úsalos en componentes

**P: ¿Cuál es la estructura de carpetas?**
R: Ver [ARCHITECTURE.md](./ARCHITECTURE.md#estructura-del-proyecto) o [DIAGRAM.md](./DIAGRAM.md)

**Ver más:** [QUICK_START.md - Debugging](./QUICK_START.md#debugging)

## 🚀 Próximos Pasos

1. **Leer [QUICK_START.md](./QUICK_START.md)** - Guía rápida de desarrollo
2. **Leer [ARCHITECTURE.md](./ARCHITECTURE.md)** - Entender la estructura completa
3. **Iniciar servidor:** `pnpm dev`
4. **Explorar los componentes** en `src/components/`
5. **Crear tu primera página** o componente

## 📞 Recursos Externos

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [pnpm Documentation](https://pnpm.io/docs)

## 📋 Checklist para Nuevo Desarrollador

- [ ] Leer QUICK_START.md
- [ ] Leer ARCHITECTURE.md
- [ ] Instalar dependencias: `pnpm install`
- [ ] Iniciar servidor: `pnpm dev`
- [ ] Explorar componentes en `src/components/`
- [ ] Crear componente de prueba
- [ ] Crear página de prueba
- [ ] Verificar TypeScript: `pnpm exec tsc --noEmit`
- [ ] Verificar ESLint: `pnpm lint`

---

**Última actualización:** 13 de abril de 2026  
**Stack:** Next.js 16 + React 19 + TypeScript + Tailwind CSS 4  
**Status:** ✅ Listo para producción
