# Estructura de Paginas - Lux Viajes Frontend

Documento que detalla la estructura jerarquica de componentes y datos de todas las paginas del proyecto.

---

## 📄 Pagina: INICIO (/)

**Archivo:** `src/app/page.tsx`

```
INICIO
├── CarruselHero (COMPONENTE)
│   └── diapositivas (LISTA) - BANNERS_HERO
│       ├── imagen: texto
│       ├── titulo: texto
│       └── subtitulo: texto
│
├── SeccionEstadisticas (COMPONENTE)
│   ├── clientesFrecuentes: numero
│   ├── experiencia: numero
│   ├── destinos: numero
│   └── valoracion: numero
│
├── SeccionDestinosSonados (COMPONENTE)
│   └── destinos (LISTA) - destinosSonados
│       ├── id: texto (implicito)
│       ├── titulo: texto
│       ├── subtitulo: texto (noches)
│       ├── descripcion: texto
│       ├── imagen: texto
│       ├── disponibilidad: texto (temporada)
│       ├── detalles:
│       │   ├── duracion: texto (duracion)
│       │   ├── precio: texto (precio)
│       │   ├── noches: texto (noches)
│       │   └── descripcionDetallada: texto (descripcion)
│       └── incluidos (LISTA):
│           └── texto (emoji + descripcion)
│
├── SeccionDetallesServicios (COMPONENTE)
│   ├── titulo: texto
│   ├── descripcion: texto
│   └── tarjetasServicio (LISTA)
│       ├── titulo: texto
│       ├── subtitulo: texto
│       └── imagen: texto
│
├── SeccionCita (COMPONENTE)
│   ├── titulo: texto
│   ├── subtitulo: texto
│   └── CTA: boton de accion
│
├── SeccionLlamadaAccion (COMPONENTE)
│   ├── titulo: texto
│   └── subtitulo: texto
│
└── DialogoContacto (MODAL)
    ├── mostrarDialogoContacto: booleano
    └── establecerMostrarDialogoContacto: funcion
```

**Tipos Principales:**

```typescript
interface PackageDetails {
  title: string;
  description: string;
  duration: string;
  price: string;
  included: string[];
  highlights?: string[];
}

interface DreamDestination extends BasePackage {
  nights: string;
  season: string;
}
```

---

## 📄 Pagina: NOSOTROS (Acerca de) (/about)

**Archivo:** `src/app/about/page.tsx`

```
NOSOTROS
├── Heroe (COMPONENTE)
│   ├── imagen: texto
│   ├── titulo: texto
│   └── subtitulo: texto
│
├── QuienesSomos (SECCION TEXTO)
│   ├── titulo: texto
│   └── descripcion: texto
│
├── PorQueElegirnos (SECCION)
│   ├── titulo: texto
│   └── destacados (LISTA)
│       ├── titulo: texto
│       ├── subtitulo: texto
│       └── icono: ElementoSVG
│
└── Valores (SECCION)
    └── valores (LISTA)
        ├── titulo: texto
        └── descripcion: texto
```

**Destacados Predefinidos:**

- Atencion personalizada
- Asesoria en visas
- Soporte 24/7
- Planificacion integral

---

## 📄 Pagina: PAQUETES (Paquetes) (/packages)

**Archivo:** `src/app/packages/page.tsx`

```
PAQUETES
├── SeccionHeroe (COMPONENTE)
│   ├── titulo: "Explora el Mundo"
│   └── subtitulo: texto
│
├── SeccionDestinosSonados (COMPONENTE)
│   └── destinos (LISTA) - destinosSonados
│       ├── titulo: texto
│       ├── noches: texto
│       ├── temporada: texto
│       ├── imagen: texto
│       ├── descripcion: texto
│       ├── duracion: texto
│       ├── precio: texto
│       └── incluidos: texto[]
│
├── SeccionPaquetesPremium (COMPONENTE)
│   └── paquetes (LISTA) - paquetesPremium
│       ├── etiqueta: texto ("Seleccion del concierge", "Popular", "Todo Incluido")
│       ├── titulo: texto
│       ├── dias: texto
│       ├── imagen: texto
│       ├── descripcion: texto
│       ├── duracion: texto
│       ├── precio: texto
│       ├── destacados (LISTA):
│       │   └── texto (descripcion de atracciones)
│       └── incluidos (LISTA):
│           └── texto (emoji + descripcion)
│
├── SeccionParquesTematicios (COMPONENTE)
│   └── parques (LISTA) - parquesTematicios
│       ├── titulo: texto
│       ├── subtitulo: texto
│       └── imagen: texto
│
├── SeccionLlamadaAccion (COMPONENTE)
│   ├── titulo: texto
│   └── subtitulo: texto
│
├── SeccionBoletin (COMPONENTE)
│   └── Formulario de suscripcion boletin
│
└── DialogoDetalles (MODAL)
    ├── mostrarDialogoDetalles: booleano
    ├── paqueteSeleccionado: DetallesPaquete | nulo
    └── visualizacion de info paquete
```

**Datos de Paquetes Principales:**

- Europa Magica (12 dias)
- Dubai Exclusivo (8 dias)
- Caribe All-Inclusive (10 dias)
- Asia Ancestral (15 dias)

**Destinos Sonados:**

- Cartagena (4 dias, 3 noches)
- Panama Low Cost (4 dias, 3 noches)
- Medellin Full Pack (4 dias, 3 noches)
- Cartagena + Panama (7 dias, 6 noches)

**Parques Tematicios:**

- Disney y Universal (Orlando)
- Europa Parks (Aventura Familiar)
- Tokyo Adventure (Parques en Japón)

---

## 📄 Pagina: SERVICIOS (Servicios) (/services)

**Archivo:** `src/app/services/page.tsx`

```
SERVICIOS
├── SeccionHeroe (COMPONENTE)
│   ├── imagen: fondo
│   ├── titulo: texto
│   └── subtitulo: texto
│
├── GrillaServicios (SECCION)
│   └── tarjetasServicio (LISTA)
│       ├── titulo: texto
│       ├── imagen: texto
│       ├── descripcion: texto (implicita en visualizacion)
│       └── grande/ancho: booleano (propiedades de grilla)
│
├── CarruselTestimonios (COMPONENTE)
│   └── testimonios (LISTA)
│       ├── nombre: texto
│       ├── texto: texto (testimonio)
│       ├── imagen: texto
│       └── destacado: booleano
│
└── DialogoContacto (MODAL)
    └── mostrarDialogoContacto: booleano
```

**Servicios Disponibles:**

- Boleto Aereo
- Paquetes Turisticos (destacado - grande)
- Tours Nacionales
- Seguros de Viaje
- Visas y Pasaportes
- Expediciones en Crucero (ancho)

---

## 📄 Pagina: CONTACTO (Contacto) (/contact)

**Archivo:** `src/app/contact/page.tsx`

```
CONTACTO
├── SeccionHeroe (COMPONENTE)
│   ├── imagen: texto
│   ├── titulo: "Contactanos"
│   └── subtitulo: texto
│
├── OpcionesContacto (SECCION)
│   └── opcionesContacto (LISTA)
│       ├── titulo: texto
│       ├── descripcion: texto
│       ├── accion: texto (boton CTA)
│       ├── enlace: texto
│       ├── imagen: texto
│       ├── esVideollamada: booleano
│       └── esAgenda: booleano
│
├── SeccionOficinas (SECCION) - id="oficinas"
│   └── oficinas (LISTA)
│       ├── ciudad: texto
│       ├── direccion: texto
│       ├── imagen: texto
│       └── urlMapa: texto
│
├── DialogoCita (MODAL)
│   └── mostrarDialogoCita: booleano
│
└── DialogoContacto (MODAL)
    └── mostrarDialogoContacto: booleano
```

**Opciones de Contacto:**

- Videollamada al Instante
- WhatsApp Directo
- Agenda tu cita Online
- Asesoria en Oficinas

**Oficinas:**

- Guayaquil (Puerto Santa Ana)
- Quito (Av. Amazonas y Eloy Alfaro)
- Cuenca (Calle Larga y Borrero)

---

## 📄 Pagina: VISAS (/visas)

**Archivo:** `src/app/visas/page.tsx`

```
VISAS
├── SeccionHeroe (COMPONENTE)
│   ├── titulo: texto
│   └── imagen de fondo
│
├── GrillaTarjetasVisa (SECCION)
│   └── tarjetasVisa (LISTA)
│       ├── pais: texto (nombre del pais/visa)
│       ├── subtitulo: texto
│       └── bandera: texto (emoji)
│
├── RequisitosVisa (SECCION DINAMICA)
│   └── requisitosVisa[pais] (OBJETO)
│       ├── duracion: texto (validez del visa)
│       ├── procesamiento: texto (tiempo de procesamiento)
│       └── requisitos (LISTA):
│           └── texto (descripcion de requisito)
│
└── DialogoContacto (MODAL)
    └── mostrarDialogoContacto: booleano
```

**Visas Soportadas:**

- Visa Americana (10 anios)
- Schengen (3 anios)
- Mexico (6 anios)
- Canada (10 anios)
- Reino Unido (2-10 anios)
- Costa Rica
- Japon
- Australia
- Visado de Estudios Largos
- Visado de Estudios Cortos

---

## 📄 Pagina: AYUDA (Ayuda) (/help)

**Archivo:** `src/app/help/page.tsx`

```
AYUDA
├── SeccionHeroe (COMPONENTE)
│   ├── titulo: texto
│   └── descripcion: texto
│
├── TemasAyuda (SECCION)
│   └── temasAyuda (LISTA)
│       ├── titulo: texto
│       ├── descripcion: texto
│       ├── icono: ComponenteIcono
│       └── girar tarjeta: booleano
│
├── CanalesSoporte (SECCION)
│   └── canalesSoporte (LISTA)
│       ├── id: texto
│       ├── titulo: texto
│       ├── descripcion: texto
│       ├── icono: ComponenteIcono
│       ├── enlace: texto
│       ├── esExterno: booleano
│       └── colorFondo: texto (clase tailwind)
│
├── Preguntas (SECCION)
│   └── preguntas (LISTA)
│       ├── pregunta: texto
│       ├── respuesta: texto
│       └── expandido: booleano
│
└── DialogoContacto (MODAL)
    └── mostrarDialogoContacto: booleano
```

**Temas de Ayuda:**

- Visas y Documentacion
- Pagos y Facturacion
- Cancelaciones y Cambios
- Programa de Lealtad
- Seguro de Viaje
- Guias de Destino

**Canales de Soporte:**

- WhatsApp Directo
- Correo Electronico
- Telefono
- Chat en Vivo

---

## 📋 Tipos y Interfaces Globales

**src/tipos/api.ts:**

```typescript
interface RespuestaAPI<T = cualquiera> {
  datos?: T;
  error?: texto;
  estado: 'exito' | 'error';
  marcaTiempo: texto;
}

interface RespuestaPaginada<T> {
  articulos: T[];
  total: numero;
  pagina: numero;
  tamanoPagina: numero;
  totalPaginas: numero;
}

interface RespuestaError {
  mensaje: texto;
  codigo: texto;
  detalles?: Registro<texto, cualquiera>;

interface RespuestaError {
  mensaje: texto;
  codigo: texto;
  detalles?: Registro<texto, cualquiera>;
}
```

**src/app/paquetes/datos/datos-paquetes.ts:**

```typescript
interface PaqueteBase {
  titulo: texto;
  imagen: texto;
  descripcion: texto;
  duracion: texto;
  incluidos: texto[];
  precio?: texto;
}

interface PaquetePremium extends PaqueteBase {
  etiqueta: texto;
  dias: texto;
  destacados: texto[];
  precio: texto;
}

interface DestinoSonado extends PaqueteBase {
  noches: texto;
  temporada: texto;
}
```

---

## 🔗 Componentes Compartidos

**Ubicacion:** `src/componentes/comun/`

- `Encabezado.tsx` - Navegacion principal
- `PiePagina.tsx` - Pie de pagina
- `Boton.tsx` - Boton reutilizable
- `Tarjeta.tsx` - Tarjeta generica
- `Heroe.tsx` - Seccion heroe
- `CarruselHeroe.tsx` - Carrusel de imagenes
- `DialogoContacto.tsx` - Modal de contacto
- `DialogoCita.tsx` - Modal de cita
- `TarjetaEstadisticas.tsx` - Tarjeta de estadisticas

**Ubicacion:** `src/componentes/secciones/`

- `SeccionEstadisticas.tsx` - Seccion de estadisticas
- `SeccionDetallesServicios.tsx` - Detalles de servicios
- `SeccionCita.tsx` - Seccion de cita
- `SeccionLlamadaAccion.tsx` - Llamada a la accion
- `TarjetaDestino.tsx` - Tarjeta de destino
- `TarjetaPaquete.tsx` - Tarjeta de paquete
- `TarjetaServicio.tsx` - Tarjeta de servicio
- `MapaPromociones.tsx` - Mapa de promociones

---

## 🎯 Patrones de Datos Comunes

### Patron 1: Banners/Carruseles

```typescript
{
  imagen: texto;
  titulo: texto;
  subtitulo: texto;
}
```

### Patron 2: Tarjetas Destacadas

```typescript
{
  titulo: texto;
  subtitulo?: texto;
  descripcion: texto;
  imagen: texto;
  icono?: ElementoSVG | ComponenteIcono;
}
```

### Patron 3: Items de Lista

```typescript
{
  id?: texto;
  titulo: texto;
  descripcion: texto;
  precio?: texto;
  duracion?: texto;
  incluidos?: texto[];
  destacados?: texto[];
}
```

### Patron 4: Opciones/Canales

```typescript
{
  id: texto;
  titulo: texto;
  descripcion: texto;
  icono?: ComponenteIcono;
  enlace: texto;
  esExterno?: booleano;
  colorFondo?: texto;
}
```

---

## 📊 Estadisticas de Estructura

- **Paginas:** 7 (inicio, acerca, paquetes, servicios, contacto, visas, ayuda)
- **Componentes comunes reutilizables:** 9
- **Componentes de seccion reutilizables:** 9
- **Componentes Modal:** 3 (DialogoContacto, DialogoCita, DialogoDetalles)
- **Interfaces principales:** 5
- **Listas/Arrays de datos:** 30+

---

## 🚀 Guia de Adicion de Nuevas Paginas

Para agregar una nueva pagina manteniendo la estructura:

1. **Crear el archivo de pagina:** `src/app/[nombre]/page.tsx`
2. **Definir estructura:** Comenzar con Heroe o SeccionHeroe
3. **Agregar secciones:** Usar componentes existentes de `sections/`
4. **Datos:** Crear archivo de datos si es necesario en carpeta `datos/`
5. **Tipos:** Extender interfaces existentes en `tipos/`
6. **Dialogos:** Usar DialogoContacto o DialogoCita existentes

---

**Ultima actualizacion:** Abril 2026
**Autor:** Documentacion de estructura de proyecto
