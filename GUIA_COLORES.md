# 🎨 Guía de Uso de Paleta de Colores - Lux Viajes

## Sistema Actual (Problema)

Tenemos **DOS sistemas de colores desconectados**:

### Sistema 1: Variables CSS (globals.css)
```css
--color-primary: #6b21a8;
--color-primary-dark: #581c87;
```
✗ **NO genera clases de Tailwind**
✗ Solo funciona con inline styles

### Sistema 2: Tailwind Config (tailwind.config.ts)
```typescript
primary: {
  600: '#9333ea',
  700: '#7e22ce',
  800: '#6b21a8',
  ...
}
```
✓ **Genera clases de Tailwind** como `bg-primary-600`, `text-primary-700`

---

## Soluciones Disponibles

### ✅ OPCIÓN 1: Usar Tailwind Classes (RECOMENDADO)

**Ventajas:**
- Funciona perfectamente con Tailwind
- Optimizado automáticamente
- Sem fallos

**Uso en componentes:**
```tsx
// ✅ CORRECTO
<div className="bg-primary-600 text-white">
  Contenido
</div>

<p className="text-neutral-700">Párrafo</p>

<span className="text-primary-600 hover:text-primary-700 transition">
  Link
</span>
```

**Clases disponibles:**
- `bg-primary-50` a `bg-primary-900`
- `text-primary-50` a `text-primary-900`
- `border-primary-50` a `border-primary-900`
- `bg-secondary-*`, `bg-tertiary-*`, `bg-neutral-*`
- `text-secondary-*`, `text-tertiary-*`, `text-neutral-*`

---

### ✅ OPCIÓN 2: Usar Variables CSS con Inline Styles

**Si NECESITAS usar variables CSS:**

```tsx
// En globals.css (ya están definidas)
--color-primary: #6b21a8;
--color-secondary: #2e1065;
--color-tertiary: #6d4100;
--color-neutral: #7c757f;

// En componentes
<div style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
  Contenido
</div>

<p style={{ color: 'var(--color-neutral)' }}>
  Texto neutral
</p>
```

**Desventajas:**
- Tailwind no la optimiza
- Mezcla CSS-in-JS con clases de Tailwind
- Menos mantenible

---

### ✅ OPCIÓN 3: Conectar Variables CSS a Tailwind

**Modificar tailwind.config.ts para usar variables CSS:**

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        50: 'var(--color-primary-light)',
        600: 'var(--color-primary)',
        800: 'var(--color-primary-dark)',
      },
      secondary: {
        600: 'var(--color-secondary)',
        800: 'var(--color-secondary)',
        900: 'var(--color-secondary-dark)',
      },
      // ... etc
    }
  }
}
```

Luego las clases de Tailwind usan las variables CSS.

---

## ✅ RECOMENDACIÓN FINAL

**Usar OPCIÓN 1 (Tailwind Classes)** porque:
1. ✓ Funciona 100% con Tailwind
2. ✓ Optimización automática
3. ✓ Zero conflictos
4. ✓ Más mantenible
5. ✓ Mejor rendimiento

---

## Ejemplo Correcto para ServicesDetailSection

```tsx
// ✅ CORRECTO
export function ServicesDetailSection() {
  return (
    <section className="py-16 md:py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sticky Panel */}
          <div className="lg:sticky lg:top-32 lg:self-start h-fit">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
              Todo lo que necesitas para tu 
              <span className="text-primary-600"> viaje perfecto</span>
            </h2>
            <p className="text-neutral-600 mt-4">
              Descripción...
            </p>
            <a href="#" className="text-primary-600 hover:text-primary-700">
              Ver todos →
            </a>
          </div>

          {/* Right Scrollable Cards */}
          <div className="lg:col-span-2 space-y-8">
            {services.map(service => (
              <div key={service.id} className="h-64 rounded-2xl overflow-hidden">
                <img src={service.image} alt={service.title} />
                <button className="bg-primary-600 hover:bg-primary-700 text-white">
                  Solicitar asesoría
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## Colores Disponibles

### Primary (Púrpura)
- 50: `#faf5ff` → 900: `#581c87`

### Secondary (Púrpura Oscuro)
- 50: `#faf5ff` → 900: `#1a0536`

### Tertiary (Marrón/Gold)
- 50: `#fffbeb` → 900: `#451a03`

### Neutral (Gris)
- 50: `#f9fafb` → 900: `#111827`

### Accent
- Red: `#dc2626`
- Green: `#10b981`
- Blue: `#3b82f6`
