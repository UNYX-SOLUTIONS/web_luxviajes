# Integración con Strapi CMS

## Configuración

El proyecto está configurado para obtener datos progresivamente desde la API de Strapi en `cms.agencialuxviajes.com`.

### Variables de Entorno

En `.env.local`:

```
NEXT_PUBLIC_STRAPI_API_URL=https://cms.agencialuxviajes.com
```

### Rutas API Disponibles

#### `/api/home` - Obtener datos de inicio

Retorna los datos de la página de inicio desde Strapi, incluyendo:

- Banners del hero carousel
- Estadísticas (clientes frecuentes, años de experiencia, destinos, rating)
- Redes sociales

**Respuesta:**

```json
{
  "id": number,
  "documentId": string,
  "createdAt": string,
  "updatedAt": string,
  "publishedAt": string,
  "banners": [
    {
      "id": number,
      "title": string,
      "subtitle": string,
      "image": string,
      "order": number,
      "active": boolean
    }
  ],
  "redes": [
    {
      "id": number,
      "platform": string,
      "url": string
    }
  ],
  "stats": {
    "id": number,
    "frequent_clients": string,
    "years_experience": string,
    "destinations": string,
    "rating": string
  }
}
```

## Servicios

### `src/services/strapi.ts`

Contiene funciones para obtener datos de Strapi:

- `getStrapiData<T>(url: string)`: Función genérica para obtener datos
- `getHomeData()`: Obtiene datos base del home
- `getHomeBannerData()`: Obtiene los banners con sus imágenes
- `getHome()`: Combina ambos y retorna el objeto completo (con caché)
- `clearHomeCache()`: Limpia el caché

## Hooks Personalizados

### `useHomeData()`

Hook para obtener datos del home desde el cliente.

**Uso:**

```tsx
const { data, loading, error } = useHomeData();

if (loading) return <LoadingScreen />;
if (error) return <ErrorScreen />;

return <HeroCarousel slides={data.banners} />;
```

**Retorna:**

```tsx
{
  data: Home | null,      // Datos del home
  loading: boolean,       // Si está cargando
  error: Error | null     // Error si ocurrió
}
```

## Carga Progresiva

El componente `page.tsx` ahora carga datos progresivamente:

1. Muestra un spinner mientras carga
2. Si hay un error, muestra mensaje de error
3. Una vez cargado, muestra el hero carousel con los banners
4. Si no hay banners, muestra un mensaje informativo

## Próximos Pasos

- Integrar más endpoints de Strapi (destinos, paquetes, servicios)
- Implementar infinite scroll para destinos
- Agregar búsqueda y filtros
- Carga progresiva de más secciones
