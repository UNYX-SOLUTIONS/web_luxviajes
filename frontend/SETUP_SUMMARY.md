# 🎯 Docker Setup para Lux Viajes - Resumen Visual

## 📊 Estructura Deployada

```
┌─────────────────────────────────────────────────────────────┐
│                       HOSTINGER VPS                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          Docker Engine & Docker Compose               │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │   luxviajes-app (Container)                      │ │ │
│  │  │                                                  │ │ │
│  │  │  ┌────────────────────────────────────────────┐ │ │ │
│  │  │  │  Next.js Application (node:20-alpine)     │ │ │ │
│  │  │  │  ├─ .next/ (build optimizado)             │ │ │ │
│  │  │  │  ├─ public/ (assets)                       │ │ │ │
│  │  │  │  ├─ node_modules/ (deps)                   │ │ │ │
│  │  │  │  └─ Puerto: 3000                           │ │ │ │
│  │  │  └────────────────────────────────────────────┘ │ │ │
│  │  │                                                  │ │ │
│  │  │  Health Checks:  ✓ Cada 30s                    │ │ │
│  │  │  Restart: always (auto-recuperación)           │ │ │
│  │  │  Memory: Límite 1GB                            │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                        ▲                             │ │
│  │                        │                             │ │
│  │                  Port 3000 (interno)                 │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ▲                              │
│                           │                              │
│                    Proxy hacia:                          │
│                    127.0.0.1:3000                        │
│                                                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │         Nginx (Proxy Inverso - En Host)          │ │
│  │                                                    │ │
│  │  ┌────────────────────────────────────────────┐  │ │
│  │  │ SSL/TLS (Let's Encrypt)                    │  │ │
│  │  │ HSTS, CSP, Security Headers                │  │ │
│  │  │ Gzip Compression                           │  │ │
│  │  │ Cache (365 días para assets)               │  │ │
│  │  │ Rate Limiting                              │  │ │
│  │  └────────────────────────────────────────────┘  │ │
│  │                                                    │ │
│  │  Puerto 80  → Redirige a 443                      │ │
│  │  Puerto 443 → HTTPS (seguro)                      │ │
│  └────────────────────────────────────────────────────┘ │
│                           ▲                              │
└───────────────────────────┼──────────────────────────────┘
                            │
                   Internet / Dominio
                   luxviajes.com
```

---

## 📈 Flujo de Deployment

```
1. GIT PUSH
   └─ Cambios en repo
      └─ Ramas: main, desarrollo, etc

         2. SSH AL VPS
            └─ Conectar con: ssh root@ip

               3. GIT PULL
                  └─ Descargar cambios: git pull origin main

                     4. DOCKER COMPOSE BUILD
                        └─ Construir imagen (multi-stage)
                           Stage 1: Compile
                           Stage 2: Runtime

                           5. DOCKER COMPOSE UP -D
                              └─ Iniciar contenedor
                                 ├─ Descargar imagen base
                                 ├─ Instalar dependencias
                                 ├─ Ejecutar app
                                 └─ Health check OK ✓

                                 6. NGINX RELOAD
                                    └─ Recargar config
                                       ├─ SSL certificado
                                       ├─ Proxy activo
                                       └─ Cache activo

                                       7. ✅ LIVE!
                                          └─ App disponible en
                                             https://luxviajes.com
```

---

## 🔑 Archivos Clave

| Archivo | Propósito | Ubicación |
|---------|-----------|-----------|
| `Dockerfile` | Build de imagen | `/frontend/` |
| `docker-compose.yml` | Orquestación | `/frontend/` |
| `deploy-docker.sh` | Script auto | `/frontend/` |
| `nginx.conf` | Proxy config | `/frontend/` |
| `.env.local` | Variables secretas | `/frontend/` (gitignore) |
| `.dockerignore` | Excluir del build | `/frontend/` |

---

## 🚀 3 Formas de Deployar

### A. Script Automático (RECOMENDADO)
```bash
cd /var/www/web_luxviajes/frontend
./deploy-docker.sh main
# Listo en ~5 minutos
```
✅ Todo automático  
✅ Health checks  
✅ Logs visuales  

### B. Comandos Manuales
```bash
git pull origin main
docker compose down
docker compose build --no-cache
docker compose up -d
docker compose logs -f
```
✅ Control total  
✅ Debug fácil  

### C. Desde Local (SSH one-liner)
```bash
ssh root@VPS "/var/www/web_luxviajes/frontend/deploy-docker.sh main"
```
✅ Deploy remoto  
✅ Sin login manual  

---

## 🛡️ Capas de Seguridad

```
┌──────────────────────────────────────────┐
│  1. Firewall (UFW en VPS)                │
│     Bloquear puertos excepto 22,80,443   │
└──────────────────────────────────────────┘
            ▼
┌──────────────────────────────────────────┐
│  2. Nginx Security Headers               │
│     HSTS, CSP, X-Frame-Options, etc      │
│     SSL/TLS obligatorio                  │
└──────────────────────────────────────────┘
            ▼
┌──────────────────────────────────────────┐
│  3. Nginx Blocking                       │
│     ✗ .git  ✗ .env  ✗ node_modules      │
└──────────────────────────────────────────┘
            ▼
┌──────────────────────────────────────────┐
│  4. Docker Container                     │
│     User: nextjs (no root)               │
│     Read-only filesystem (parcial)       │
│     Limites de recursos                  │
└──────────────────────────────────────────┘
```

---

## 📋 Checklist Pre-Deployment

- [ ] Dominio apunta a VPS ✓
- [ ] SSH funciona ✓
- [ ] Docker instalado ✓
- [ ] Repo clonado ✓
- [ ] `.env.local` configurado ✓
- [ ] Certificado SSL ready (Let's Encrypt) ✓
- [ ] Nginx configurado ✓
- [ ] Puertos 80/443 abiertos ✓

---

## 📊 Monitoreo

### Ver en tiempo real
```bash
# Logs de la app
docker compose logs -f

# Recursos del contenedor
docker stats luxviajes-app

# Estado general
docker compose ps
```

### URLs útiles
- App: `https://luxviajes.com`
- VPS SSH: `ssh root@tu-ip-vps`
- Health: `curl https://luxviajes.com/health`

---

## 🔄 Workflow Diario

```
Morning Check
├─ Verificar logs: docker compose logs --tail=100
├─ Ver stats: docker stats --no-stream
└─ Test health: curl https://luxviajes.com

Code Update (cuando hay cambios)
├─ Git pull: git pull origin main
├─ Deploy: ./deploy-docker.sh main
└─ Verify: docker compose ps

Backup (diario)
└─ tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/web_luxviajes

Maintenance (semanal)
├─ Limpiar imagenes: docker image prune -f
├─ Ver logs de error: docker compose logs --tail=500 | grep ERROR
└─ Renewal SSL: certbot renew --dry-run
```

---

## 🆘 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| App no inicia | `docker compose logs luxviajes-app` |
| Puerto 3000 en uso | Cambiar puerto en docker-compose.yml |
| Out of memory | Aumentar límites en deploy.resources |
| Nginx error | `nginx -t` y `systemctl status nginx` |
| SSL expirado | `certbot renew` |

---

## 📞 Documentación

- **Quick Start**: `DOCKER_DEPLOYMENT_QUICK_START.md` ⭐ COMIENZA AQUÍ
- **Completa**: `HOSTINGER_DEPLOYMENT.md`
- **General**: `DOCKER_README.md`
- **Comandos**: `DOCKER_COMMANDS_CHEATSHEET.sh`

---

**¡Tu proyecto está listo para volar! 🚀**

Siguiendo estos pasos estarás en producción en minutos.
