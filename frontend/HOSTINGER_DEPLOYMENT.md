# Despliegue en Hostinger

## Carpetas y archivos generados para producción

### Carpetas principales:

- **.next/** - Contiene el build optimizado de Next.js para producción
- **public/** - Assets estáticos (imágenes, CSS, JS)
- **node_modules/** - Dependencias del proyecto

### Archivos necesarios:

- **package.json** - Definición del proyecto y dependencias
- **pnpm-lock.yaml** - Lock file para reproducir las dependencias exactas
- **next.config.ts** - Configuración de Next.js
- **tsconfig.json** - Configuración de TypeScript
- **tailwind.config.ts** - Configuración de Tailwind CSS
- **postcss.config.mjs** - Configuración de PostCSS
- **eslint.config.mjs** - Configuración de ESLint

## Pasos para desplegar en Hostinger:

### 1. Preparar los archivos

Copia estas carpetas y archivos a Hostinger:

```
.next/
public/
node_modules/ (o ejecutar 'pnpm install' en el servidor)
package.json
pnpm-lock.yaml
next.config.ts
tsconfig.json
tailwind.config.ts
postcss.config.mjs
.env.local (con tus variables de entorno)
```

### 2. En Hostinger - Instalación

Si usas cPanel o File Manager:

1. Conecta vía SSH o SFTP
2. Copia los archivos a la carpeta del proyecto
3. Ejecuta: `pnpm install` (si no copias node_modules)
4. Ejecuta: `pnpm build` (para regenerar .next)

### 3. En Hostinger - Configuración Node.js

1. En cPanel, ve a "Node.js Manager" o "Application Manager"
2. Crea una nueva aplicación Node.js
3. Configuración recomendada:
   - **Node.js version**: 20.x o superior
   - **Entry point**: next/dist/server/lib/start-server.js
   - **App URL**: tu-dominio.com
   - **App root path**: /home/usuario/public_html/tu-app

### 4. Variables de entorno (.env.local)

Crea un archivo `.env.local` en Hostinger con:

```
NEXT_PUBLIC_API_URL=tu-url-api
# Agrega aquí otras variables necesarias
```

### 5. Iniciar la aplicación

En cPanel:

1. Ve a "Node.js Manager"
2. Selecciona tu aplicación
3. Haz clic en "Start" o "Restart"

### 6. Configurar dominio

1. En cPanel, ve a "Addon Domains" o "Parked Domains"
2. Apunta tu dominio a la aplicación Node.js
3. Configura SSL/TLS (recomendado)

## Archivos generados por el build:

```
.next/
├── cache/
├── server/
├── static/
└── BUILD_ID
```

Estos archivos son lo que Next.js necesita para servir la aplicación en producción.

## Comandos útiles en Hostinger (vía SSH):

```bash
# Instalar dependencias
pnpm install

# Generar build
pnpm build

# Iniciar en producción (si necesitas hacerlo manual)
pnpm start

# Ver logs
tail -f /var/log/node.log
```

## Recomendaciones:

1. **Reverse Proxy**: Hostinger puede configurar nginx como reverse proxy
2. **SSL**: Usa certificados Let's Encrypt (gratuito en Hostinger)
3. **Monitoreo**: Habilita alerts de caída de la aplicación
4. **Backups**: Configura backups automáticos
5. **Environment**: Usa un archivo `.env.production.local` para variables de producción

## Tamaño del build:

El build de Next.js optimizado ocupa aproximadamente:

- **.next/**: ~100MB (depende de tus assets)
- **node_modules/**: ~500MB (se puede comprimir)

---

**Fecha de generación**: ${new Date().toLocaleString('es-ES')}
**Versión de Next.js**: 16.2.3
