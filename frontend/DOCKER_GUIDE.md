# Docker - Guía de Deploy desde carpeta 'deploy'

## ¿Cómo funciona?

El Dockerfile toma los archivos pre-compilados de la carpeta `deploy/` que ya contiene:

- `.next/` (aplicación compilada)
- `public/` (archivos estáticos)
- Configuración de Next.js

**No necesita hacer build**, solo instala dependencias y ejecuta.

## Pasos previos

1. **Generar la carpeta deploy** (si aún no existe):
   ```bash
   .\prepare_hostinger.bat
   ```

## Construcción

```bash
# Opción 1: Build simple
docker build -t luxviajes:latest .

# Opción 2: Con docker-compose (recomendado)
docker-compose build
```

## Ejecución

### Con docker-compose (recomendado)

```bash
docker-compose up -d
```

### Con Docker directamente

```bash
docker run -d -p 3000:3000 --name luxviajes-app luxviajes:latest
```

## Acceso a la aplicación

Abre en el navegador: **http://localhost:3000**

## Logs

```bash
docker-compose logs -f luxviajes-web
```

## Detener

```bash
docker-compose down
```

## Actualizar tras cambios

```bash
# 1. Regenerar deploy
.\prepare_hostinger.bat

# 2. Reconstruir imagen
docker-compose up -d --build
```

## Para Hostinger

1. Asegúrate que la carpeta `deploy/` tenga los archivos actualizados
2. Construir: `docker build -t luxviajes:latest .`
3. Taggear: `docker tag luxviajes:latest tu-docker-hub/luxviajes:latest`
4. Push: `docker push tu-docker-hub/luxviajes:latest`
5. En Hostinger, usar tu imagen del registro

## Características

- ✅ Usa archivos pre-compilados (sin build adicional)
- ✅ Imagen pequeña (~150-200MB)
- ✅ Alpine Linux (base ligera)
- ✅ Usuario no-root (seguridad)
- ✅ Health checks automáticos
- ✅ Logs configurados
- ✅ Ready para producción

## Ventajas

- ⚡ **Más rápido**: No compila en el contenedor
- 📦 **Más pequeño**: Solo copia archivos compilados
- 🚀 **Deploy directo**: La carpeta `deploy` ya está lista
- 💾 **Eficiente**: Reutiliza el build local
