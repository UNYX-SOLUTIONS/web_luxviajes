# 🚀 Guía Rápida de Desarrollo - Luxviajes

## Inicio Rápido

```bash
# Entrar a la carpeta frontend
cd frontend

# Instalar dependencias (primera vez)
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Abrir en navegador
# http://localhost:3000
```

## Agregar un Nuevo Componente

### 1. Componente Reutilizable (common)

```bash
# Crear archivo: src/components/common/NuevoComponente.tsx

'use client';  // Si es interactivo

import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

interface NuevoComponenteProps {
  className?: string;
  children: ReactNode;
}

export function NuevoComponente({ className, children }: NuevoComponenteProps) {
  return (
    <div className={cn('base-styles', className)}>
      {children}
    </div>
  );
}
```

### 2. Actualizar Barrel Export

```typescript
// src/components/common/index.ts
export { NuevoComponente } from './NuevoComponente';
```

### 3. Usar en otra parte

```typescript
import { NuevoComponente } from '@/components/common';

// Usar directamente
<NuevoComponente>Contenido</NuevoComponente>
```

## Agregar una Nueva Página

```bash
# Crear carpeta: src/app/nueva-pagina

# Crear archivo: src/app/nueva-pagina/page.tsx
export default function NuevaPagina() {
  return <div>Mi nueva página</div>;
}

# Automáticamente accesible en: /nueva-pagina
```

## Agregar un Nuevo Servicio

```typescript
// src/services/nuevoServicio.ts

export interface NuevoTipo {
  id: string;
  nombre: string;
}

export const mockData: NuevoTipo[] = [
  { id: '1', nombre: 'Item 1' },
];

export async function obtenerDatos(): Promise<NuevoTipo[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockData;
}
```

## Agregar un Nuevo Tipo

```typescript
// src/types/index.ts

export interface NuevoTipo {
  id: string;
  titulo: string;
  descripcion: string;
  [propiedad]: tipo;
}
```

## Agregar Estilos Globales

```css
/* src/app/globals.css */

/* Los estilos globales van aquí */
@import "tailwindcss";

/* Variables CSS personalizadas */
:root {
  --color-custom: #valor;
}
```

## Agregar Utilitarios

```typescript
// src/utils/nuevoUtil.ts

export function miUtilidad(parametro: string): string {
  // Lógica aquí
  return resultado;
}
```

## Convenciones de Código

### ✅ SÍ

```typescript
// Imports ordenados
import { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common';
import { miTipo } from '@/types';

// Props con interface
interface MiComponenteProps {
  title: string;
  children: ReactNode;
}

// 'use client' al inicio de componentes interactivos
'use client';

// Nombres descriptivos
const handleClick = () => {};
```

### ❌ NO

```typescript
// Imports desordenados
import miTipo from '@/types/...';
import something from 'next/...';

// Props sin tipado
function MiComponente(props) {}

// Nombres genéricos
const handle = () => {};
const x = 5;
```

## Temas de TypeScript

### Componente con Props

```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return <button className={...}>{props.children}</button>;
}
```

### Hook Personalizado

```typescript
import { useState, useEffect } from 'react';

export function useCustom(initialValue: string) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    // Effects aquí
  }, []);

  return { value, setValue };
}
```

## Debugging

### Ver errores de TypeScript

```bash
pnpm exec tsc --noEmit
```

### Ver errores de ESLint

```bash
pnpm lint
```

### Ver en Dev con logs

```typescript
console.log('Debug:', valor);
```

## Estructura para Nueva Sección en Home

```typescript
// 1. Crear componentes en src/components/sections/
import { ComponenteDatos } from '@/types';
export function MiSectionCard({ data }: { data: ComponenteDatos }) {
  return <div>{/* Layout aquí */}</div>;
}

// 2. Crear servicio en src/services/
export async function obtenerComponentes(): Promise<ComponenteDatos[]> {
  return mockData;
}

// 3. Usar en src/app/page.tsx
import { MiSectionCard } from '@/components/sections';
import { obtenerComponentes } from '@/services';

// En el componente Home:
const datos = await obtenerComponentes();
<section>
  {datos.map(item => <MiSectionCard key={item.id} data={item} />)}
</section>
```

## Deploy

### Vercel (Recomendado)

```bash
# 1. Push a GitHub
git add .
git commit -m "Mensaje"
git push origin main

# 2. En Vercel.com conecta el repo
# 3. Deploy automático en cada push
```

### Manual

```bash
pnpm build
pnpm start
# Abre http://localhost:3000
```

## Checklist antes de Commit

- [ ] Sin errores de TypeScript (`pnpm exec tsc --noEmit`)
- [ ] Sin errores de ESLint (`pnpm lint`)
- [ ] Componentes tienen Props bien tipadas
- [ ] Archivos organizados en carpeta correcta
- [ ] Barrel exports actualizados
- [ ] Mensajes de commit claros
- [ ] Sin console.log en producción

## Links Útiles

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [pnpm Docs](https://pnpm.io)

## Contacto para dudas

Para ayuda con la arquitectura, consulta:
- `ARCHITECTURE.md` - Documentación completa
- `DIAGRAM.md` - Diagrama visual
- Archivos en `src/` - Ejemplos de código
