# 🐳 Docker Configuration para Luxviajes - Hostinger VPS

Este directorio contiene la configuración completa para deployar la aplicación Next.js en Hostinger VPS usando Docker.

## 📋 Archivos Configurados

### Dockerización
- **`Dockerfile`** - Multi-stage build optimizado (development + production)
- **`.dockerignore`** - Archivos excluidos del build
- **`docker-compose.yml`** - Orquestación estándar (producción)
- **`docker-compose.prod.yml`** - Configuración avanzada con monitoreo opcional

### Deployment
- **`deploy-docker.sh`** - Script bash automático (para Linux/Mac)
- **`deploy-docker.ps1`** - Script PowerShell (para Windows)
- **`nginx.conf`** - Configuración proxy inverso optimizado

### Documentación
- **`DOCKER_DEPLOYMENT_QUICK_START.md`** - Guía rápida de 5 pasos ⭐ **EMPEZAR AQUÍ**
- **`HOSTINGER_DEPLOYMENT.md`** - Documentación completa
- **`este archivo (README.md)`** - Este documento

### Configuración
- **`.env.production.example`** - Variables de entorno de ejemplo

---

## 🚀 Quick Start (3 minutos)

### 1. Conectar al VPS
```bash
ssh root@tu-ip-vps
```

### 2. Instalar Docker
```bash
apt update && apt install -y docker.io docker-compose-plugin git
systemctl start docker
```

### 3. Clonar Proyecto
```bash
cd /var/www
git clone https://tu-repo-github.com/web_luxviajes.git
cd web_luxviajes/frontend
```

### 4. Configurar Entorno
```bash
cp .env.production.example .env.local
nano .env.local  # Editar variables
```

### 5. Ejecutar
```bash
docker compose build
docker compose up -d
docker compose logs -f
```

✅ **¡Lista!** Tu app está en `http://tu-dominio.com:3000`

---

## 📚 Documentación Detallada

### Para empezar rápido
👉 Lee: **[DOCKER_DEPLOYMENT_QUICK_START.md](./DOCKER_DEPLOYMENT_QUICK_START.md)**

### Para deployment completo con SSL
👉 Lee: **[HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md)**

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────┐
│          Internet / Dominio                  │
└────────────────────┬────────────────────────┘
                     │
        ┌────────────▼─────────────┐
        │   Nginx Port 80/443      │
        │  (Proxy + SSL/TLS)       │
        └────────────┬─────────────┘
                     │
        ┌────────────▼─────────────┐
        │  Docker Container        │
        │  Next.js Port 3000       │
        │  ├─ .next (build)        │
        │  ├─ public (assets)      │
        │  └─ node_modules         │
        └──────────────────────────┘
```

---

## 🔧 Comandos Útiles

```bash
# Ver estado
docker compose ps

# Ver logs en vivo
docker compose logs -f luxviajes-app

# Reiniciar
docker compose restart

# Detener
docker compose down

# Reconstruir
docker compose build --no-cache

# Estadísticas del contenedor
docker stats luxviajes-app
```

---

## 📊 Opciones de Configuración

### Standard (docker-compose.yml)
- ✅ Contenedor Next.js simple
- ✅ Health checks automáticos
- ✅ Limites de recursos
- 📦 Tamaño imagen: ~300MB

### Avanzado (docker-compose.prod.yml)
- ✅ Nginx integrado (opcional)
- ✅ Prometheus para métricas
- ✅ Loki para logs
- ✅ Grafana para visualización
- 🚀 Usa: `docker compose -f docker-compose.prod.yml up -d --profile monitoring`

---

## 🔐 Seguridad

### Implementado
✅ Usuario no-root en contenedor (`nextjs:1001`)  
✅ SSL/TLS con Let's Encrypt  
✅ Security headers en Nginx  
✅ HSTS activado  
✅ CSP (Content Security Policy)  
✅ Archivos ocultos bloqueados  

### Recomendaciones Adicionales
- [ ] Configurar firewall (UFW)
- [ ] Backup automático
- [ ] Monitoreo de recursos
- [ ] Rate limiting en Nginx

---

## 🐛 Troubleshooting

### Contenedor no inicia
```bash
docker compose logs luxviajes-app
# Ver qué salió mal
```

### Puerto 3000 en uso
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Cambiar a 3001
```

### Out of Memory
```bash
# Aumentar límites en docker-compose.yml
deploy:
  resources:
    limits:
      memory: 2G
```

### Nginx/SSL problemas
```bash
certbot certificates
certbot renew --dry-run
nginx -t
systemctl reload nginx
```

---

## 📈 Performance

- **Build time**: ~2-3 minutos (primera vez)
- **Startup time**: ~15-20 segundos
- **Memory usage**: ~200-300MB
- **CPU usage**: Bajo en reposo

### Optimizaciones incluidas
✅ Alpine Linux (imagen pequeña)  
✅ Multi-stage build  
✅ pnpm (dependencias ligeras)  
✅ Gzip compression  
✅ Asset caching (1 año)  

---

## 🔄 Workflow CI/CD

### Actualizar manualmente
```bash
cd /var/www/web_luxviajes/frontend
./deploy-docker.sh main
```

### Actualizar por rama
```bash
./deploy-docker.sh desarrollo
```

### Desde cualquier lugar
```bash
# Conectar, ejecutar script y desconectar
ssh root@tu-ip-vps "/var/www/web_luxviajes/frontend/deploy-docker.sh main"
```

---

## 📱 Variables de Entorno Claves

```env
# Obligatorias
NEXT_PUBLIC_BASE_URL=https://luxviajes.com
NEXT_PUBLIC_API_URL=https://api.luxviajes.com

# Opcionales (según tu app)
NEXT_PUBLIC_GA_ID=UA-xxx
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## 🆘 Soporte

### Logs
```bash
# Ver logs últimas 50 líneas
docker compose logs --tail=50

# Ver logs específicos por timestamp
docker compose logs --since 10m
```

### Health Status
```bash
# Verificar que responde
curl http://localhost:3000

# Con headers
curl -I http://localhost:3000
```

### Sistema
```bash
# Espacio disponible
df -h

# Uso de memoria
free -h

# Uptime
uptime
```

---

## 🔗 Referencias Útiles

| Link | Descripción |
|------|-------------|
| [Docker Docs](https://docs.docker.com/) | Documentación oficial Docker |
| [Next.js Deployment](https://nextjs.org/docs/deployment) | Guía de deploy Next.js |
| [Nginx](https://nginx.org/en/docs/) | Documentación Nginx |
| [Let's Encrypt](https://letsencrypt.org/) | SSL/TLS gratuito |
| [Hostinger VPS](https://www.hostinger.com/vps) | VPS Hostinger |

---

## ✅ Pre-flight Checklist

Antes de deployar asegúrate de:

- [ ] Docker instalado en VPS
- [ ] Código en repositorio Git
- [ ] `.env.local` configurado
- [ ] Dominio apuntando a VPS
- [ ] Puerto 22 accesible (SSH)
- [ ] Puertos 80, 443 abiertos (Firewall)
- [ ] Certificado SSL ready (Let's Encrypt)
- [ ] `package.json` con script `build` y `start`

---

## 📞 Contacto / Problemas

Si tienes problemas:

1. Revisar [DOCKER_DEPLOYMENT_QUICK_START.md](./DOCKER_DEPLOYMENT_QUICK_START.md)
2. Revisar [HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md)
3. Ejecutar: `docker compose logs -f` para ver errores
4. Contactar al equipo DevOps

---

**Última actualización**: 27 de Abril de 2026  
**Versión**: 2.0  
**Estado**: ✅ Producción Ready
