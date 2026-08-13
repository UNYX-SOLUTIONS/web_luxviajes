# Despliegue Backend Lux Viajes — Docker en Hostinger VPS

> Stack: Node.js 20 + Express + TypeScript + Prisma + PostgreSQL 15
> Todo vive dentro de `backend/` (igual que el frontend vive en `frontend/` con su propio Docker). Strapi y n8n están fuera de este despliegue.
>
> **Despliegue completo (backend + frontend) con un solo comando:** `./scripts/deploy-all.sh` desde la raíz del repo. Orquesta los dos composes — no hay un tercer compose en la raíz (evitar duplicación).

---

## 1. Estructura generada (carpeta backend/)

| Archivo | Propósito |
|---------|-----------|
| `backend/Dockerfile` | Multi-stage: builder (tsc + prisma generate) → runtime alpine sin root |
| `backend/docker-compose.yml` | Backend + PostgreSQL (producción) |
| `backend/.env` | Archivo ÚNICO de entorno (local + VPS). Lo entrega el desarrollador — nunca al repo |
| `backend/entrypoint.sh` | Espera a PostgreSQL, aplica migraciones (`RUN_MIGRATIONS=true`) y arranca |
| `backend/.dockerignore` | Excluye node_modules, dist, .env, tests del contexto de build |
| `backend/scripts/deploy.sh` | Despliegue con un comando |
| `backend/scripts/backup-db.sh` | Backup diario de PostgreSQL con retención |

---

## 2. Decisiones tomadas

| Tema | Decisión | Justificación |
|------|----------|---------------|
| Ubicación del compose | **Dentro de `backend/`** | Consistente con `frontend/` que tiene su propio Docker; cada servicio es autocontenido |
| PostgreSQL | **Dockerizado en el mismo VPS** | 8 GB RAM / 2 cores sobran para Postgres (límite 1G) + backend (1G) + frontend. Sin costo extra, backups con un comando |
| Redis | **No incluido** | El código del backend no usa `ioredis`/`bullmq` (dependencias sin uso) |
| Migraciones | **En entrypoint con flag** | `RUN_MIGRATIONS=true` por defecto; `false` para migrar manualmente |
| Red | `luxviajes-network` compartida | El contenedor del frontend llega al backend por nombre de servicio (`backend:3001`) |
| Puertos host | Solo `127.0.0.1` | PostgreSQL (5432) y backend (3001) no quedan expuestos a internet |
| Recursos | Límites por servicio | Backend 1G, Postgres 1G — no pueden tumbar el VPS |
| Logs | Rotación json-file | 10 MB × 5 archivos por servicio — no llenan el disco de 100 GB |

---

## 3. Pasos en el VPS de Hostinger

### 3.1 Requisitos

```bash
# Docker + plugin compose (si no está instalado)
sudo apt update
sudo apt install -y docker.io docker-compose-plugin git
sudo systemctl enable --now docker
```

### 3.2 Clonar y configurar

```bash
cd /root
git clone <URL_DEL_REPO> luxviajes
cd luxviajes/backend
```

**El `.env` ya está listo** (archivo único por servicio, lo entrega el desarrollador). Verifica que contenga los valores de producción:

```env
DATAFAST_ENV=test           # ← el compose lo fuerza a production en el VPS
DATAFAST_PROD_ENTITY_ID=<entity id de producción>
DATAFAST_PROD_BEARER_TOKEN=<access token de producción>
DATAFAST_PROD_MERCHANT_ID=4100010042
DATAFAST_PROD_TERMINAL_ID=BP467901
DATAFAST_PROD_BASE_URL=https://eu-prod.oppwa.com
DATAFAST_PROD_SHOPPER_RESULT_URL=https://luxviajes.com/pago/resultado
ALLOWED_ORIGINS=https://luxviajes.com
```

> Con `DATAFAST_ENV=production`, el `testMode` nunca se envía y se leen únicamente las variables `DATAFAST_PROD_*`. En desarrollo local basta cambiar `DATAFAST_ENV=test` y el bloque `DATAFAST_TEST_*`.

### 3.3 Primer despliegue

```bash
chmod +x scripts/deploy.sh scripts/backup-db.sh
./scripts/deploy.sh
```

El script: crea la red, construye la imagen, levanta los contenedores, aplica las migraciones automáticamente y muestra los logs.

### 3.4 Verificar

```bash
curl http://localhost:3001/health          # → {"status":"ok",...}
docker compose ps                          # ambos servicios "healthy"
docker compose logs -f backend             # logs en vivo
```

### 3.5 Recuperar datos locales (una sola vez)

Si la base de producción debe iniciar con los datos que ya tienes local:

```bash
# En tu PC: exportar
pg_dump -U postgres -d luxdb -Fc -f luxdb.dump

# En el VPS: copiar y restaurar
scp luxdb.dump root@<IP_VPS>:/root/luxviajes/backend/
docker compose cp luxdb.dump postgres:/tmp/luxdb.dump
docker compose exec postgres pg_restore -U luxviajes -d luxviajes_db --clean --if-exists /tmp/luxdb.dump
```

---

## 4. Backups

```bash
# Manual (desde backend/)
./scripts/backup-db.sh

# Automático: todos los días a las 3:00 AM, retención 7 días
crontab -e
# agregar:
0 3 * * * /root/luxviajes/backend/scripts/backup-db.sh >> /var/log/luxviajes-backup.log 2>&1
```

Restaurar un backup:

```bash
gunzip -c /root/backups/db/luxviajes_20260813_030000.sql.gz | docker compose exec -T postgres psql -U luxviajes -d luxviajes_db
```

---

## 5. Actualizaciones sin downtime

```bash
cd /root/luxviajes/backend
git pull
docker compose up -d --build backend   # Docker arranca el nuevo contenedor y apaga el viejo
```

El contenedor nuevo aplica migraciones al iniciar (si `RUN_MIGRATIONS=true`). Con `restart: unless-stopped`, el servicio vuelve solo tras un reinicio del VPS.

---

## 6. Conexión con Traefik y el frontend dockerizado

**Infraestructura real del VPS:** Traefik (puertos 80/443) es el proxy central — Strapi (`cms-luxviajes`, `127.0.0.1:1337`) y n8n (`127.0.0.1:5678`) ya viven detrás de él. El frontend de Lux Viajes se suma igual: contenedor en `127.0.0.1:3000` + red externa de Traefik.

```
Internet → Traefik (80/443)
   ├── agencialuxviajes.com      → luxviajes-app:3000
   ├── cms.agencialuxviajes.com  → cms-luxviajes:1337
   └── flow.agencialuxviajes.com → n8n:5678
                     │
   luxviajes-app ────┴── red luxviajes-network → backend:3001 → postgres:5432
```

### 6.1 Antes de desplegar: verificar la config real de Traefik

```bash
# 1. Nombre de la red de Traefik
docker network ls | grep -i traefik
#   ej: xdid_proxy, traefik-proxy, traefik_default → ponerlo en TRAEFIK_NETWORK

# 2. Nombre del certresolver (en traefik.yml del VPS)
docker exec traefik-xdid-traefik-1 cat /etc/traefik/traefik.yml | grep -A3 certificatesResolvers
#   ej: "le", "letsencrypt", "cloudflare" → ponerlo en CERT_RESOLVER

# 3. Entrypoints definidos (ej: web, websecure)
docker exec traefik-xdid-traefik-1 cat /etc/traefik/traefik.yml | grep -A2 entryPoints
```

Ajustar en `frontend/.env` del VPS (archivo único que entrega el desarrollador):

```env
DOMAIN=agencialuxviajes.com
TRAEFIK_NETWORK=<nombre real de la red>
CERT_RESOLVER=<nombre real del certresolver>
PAYMENTS_BACKEND_URL=http://backend:3001
JWT_SECRET=<clave larga aleatoria>
```

### 6.2 Despliegue del frontend

```bash
cd /root/luxviajes/frontend
docker compose -f docker-compose.prod.yml up -d --build
```

Traefik detecta el contenedor por los labels y genera el certificado automáticamente. Verificar:

```bash
curl -s -o /dev/null -w '%{http_code}' https://agencialuxviajes.com   # → 200
```

### 6.3 Conexión frontend → backend

El proxy del frontend (`next.config.ts`) usa la variable **solo servidor** `PAYMENTS_BACKEND_URL` (no va al navegador):

```typescript
destination: `${process.env.PAYMENTS_BACKEND_URL || "http://localhost:3001"}/api/payments/:path*`,
```

En producción el compose la pasa como build arg con default `http://backend:3001` (resolución por red Docker). En local no se necesita (usa `localhost:3001`).

### 6.4 El backend NO se expone

El backend publica solo `127.0.0.1:3001` (localhost del host) y PostgreSQL `127.0.0.1:5432` — ninguno es alcanzable desde internet. Traefik solo enruta al frontend. No existe dominio `api.*` para el backend.

---

## 7. Recomendaciones de seguridad

1. **Generar `package-lock.json`** en el backend (`npm install --package-lock-only`) y commitearlo — hace los builds reproducibles y permite usar `npm ci`
2. Cambiar el puerto SSH del VPS y usar solo llaves (sin password)
3. `ufw allow 80,443` y `ufw deny 3001,5432` (los puertos ya están atados a 127.0.0.1, doble protección)
4. Rotar `DB_PASSWORD` cada 90 días
5. Monitorear disco: `df -h` semanal — la rotación de logs + retención de backups protegen los 100 GB

---

## 8. Troubleshooting

| Síntoma | Solución |
|---------|----------|
| `DB_PASSWORD es requerida` | Falta la variable en `backend/.env` — pedir el archivo al desarrollador |
| El backend reinicia en loop | `docker compose logs backend` — casi siempre es DATABASE_URL o migración pendiente |
| `prisma migrate deploy` falla | Verificar `postgres` healthy: `docker compose ps`; revisar credenciales DB en `.env` |
| Frontend no llega al backend | Revisar sección 6 (rewrite a `http://backend:3001` + red compartida) |
| No aparecen los logs de pino | Es normal en producción — solo stdout nivel info; `docker compose logs -f backend` |
