# Packages Page - Estructura Modular

## 📁 Estructura de Carpetas

```
packages/
├── page.tsx                 # Página principal (limpia y legible)
├── components/              # Componentes de secciones
│   ├── index.ts            # Exporta todos los componentes
│   ├── HeroSection.tsx      # Sección hero principal
│   ├── DreamDestinationsSection.tsx  # Top destinos del mes
│   ├── PremiumPackagesSection.tsx    # Paquetes con carousel
│   ├── ThemeParksSection.tsx         # Parques temáticos
│   ├── CtaSection.tsx       # Call to action
│   └── NewsletterSection.tsx # Suscripción a newsletter
└── data/
    └── packages-data.ts    # Datos centralizados
```

## 🎯 Ventajas de esta Estructura

### 1. **Separación de Responsabilidades**
- Cada componente tiene una única responsabilidad
- Los datos están centralizados en `data/packages-data.ts`

### 2. **Mantenibilidad**
- Fácil de actualizar datos sin tocar componentes
- Cambios de UI aislados en componentes específicos
- Código más legible y enfocado

### 3. **Reutilización**
- Los componentes pueden usarse en otras páginas
- Lógica del carousel encapsulada en `PremiumPackagesSection`

### 4. **Escalabilidad**
- Fácil agregar nuevas secciones
- Fácil agregar propiedades a componentes existentes

## 📝 Cómo Usar

### Agregar una Nueva Sección

1. Crear archivo en `components/`, p.ej. `NewSection.tsx`:
```tsx
import type { FC } from "react";

interface NewSectionProps {
  // Tus props aquí
}

export const NewSection: FC<NewSectionProps> = (props) => {
  return (
    <section>
      {/* Contenido */}
    </section>
  );
};
```

2. Exportar desde `components/index.ts`
3. Usar en `page.tsx`

### Agregar Nuevos Datos

1. Agregar a `data/packages-data.ts`
2. Importar en `page.tsx`
3. Pasar como prop al componente

## 🔄 Flujo de Datos

```
page.tsx (estado)
    ↓
    ├─→ HeroSection
    ├─→ DreamDestinationsSection (recibe: destinations, onCotizar)
    ├─→ PremiumPackagesSection (recibe: packages)
    ├─→ ThemeParksSection (recibe: parks)
    ├─→ CtaSection (recibe: onContactClick)
    ├─→ NewsletterSection
    └─→ ContactDialog (recibe: showContactDialog, onClose)
```

## 🎨 Componentes Disponibles

### HeroSection
- Sin props
- Sección hero estática

### DreamDestinationsSection
- `destinations`: Array de destinos
- `onCotizar`: Callback para abrir contact dialog

### PremiumPackagesSection
- `packages`: Array de paquetes
- Maneja su propio estado del carousel

### ThemeParksSection
- `parks`: Array de parques

### CtaSection
- `onContactClick`: Callback para abrir contact dialog

### NewsletterSection
- Sin props
- Sección estática

## 🚀 Siguientes Pasos

- [ ] Agregar validación de formulario en NewsletterSection
- [ ] Conectar endpoint de suscripción
- [ ] Agregar más destinos dinámicamente
- [ ] Implementar filtros en secciones
