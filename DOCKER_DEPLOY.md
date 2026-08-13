# Despliegue Backend Lux Viajes — Docker en Hostinger VPS

> Stack: Node.js 20 + Express + TypeScript + Prisma + PostgreSQL 15
> Todo vive dentro de `backend/` (igual que el frontend vive en `frontend/` con su propio Docker). Strapi y n8n están fuera de este despliegue.

---

## 1. Estructura generada (carpeta backend/)

| Archivo | Propósito |
|---------|-----------|
| `backend/Dockerfile` | Multi-stage: builder (tsc + prisma generate) → runtime alpine sin root |
| `backend/docker-compose.yml` | Backend + PostgreSQL (producción) |
| `backend/.env.docker.example` | Plantilla de variables de Docker — copiar a `.env` (nunca al repo) |
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

# Variables de entorno REALES de Docker
cp .env.docker.example .env
nano .env   # ← llenar todos los valores (Datafast prod, DB_PASSWORD, URLs)
```

Verifica que en `.env` estén:

```env
DATAFAST_ENV=production
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

## 6. Conexión con el frontend dockerizado

Los contenedores del frontend y backend deben estar en la misma red `luxviajes-network`. El proxy del frontend (`next.config.ts`) apunta a `http://localhost:3001` por defecto, que **no resuelve** dentro del contenedor del frontend.

**Solución aplicada:** el rewrite ahora usa la variable `NEXT_PUBLIC_PAYMENTS_BACKEND_URL` (con fallback a `localhost:3001` para desarrollo local):

```typescript
// frontend/next.config.ts
destination: `${process.env.NEXT_PUBLIC_PAYMENTS_BACKEND_URL || "http://localhost:3001"}/api/payments/:path*`,
```

En el `.env.production` del frontend (VPS) agregar:

```env
NEXT_PUBLIC_PAYMENTS_BACKEND_URL=http://backend:3001
```

Y en el `docker-compose` del frontend, asegurarse de que el servicio esté en la red:

```yaml
networks:
  luxviajes-network:
    name: luxviajes-network
    driver: bridge
```

Después: `docker compose build && docker compose up -d` en el directorio del frontend. En local no se necesita ninguna variable (usa `localhost:3001`).

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
| `DB_PASSWORD es requerida` | Falta la variable en `backend/.env` — copiar de `.env.docker.example` |
| El backend reinicia en loop | `docker compose logs backend` — casi siempre es DATABASE_URL o migración pendiente |
| `prisma migrate deploy` falla | Verificar `postgres` healthy: `docker compose ps`; revisar credenciales DB en `.env` |
| Frontend no llega al backend | Revisar sección 6 (rewrite a `http://backend:3001` + red compartida) |
| No aparecen los logs de pino | Es normal en producción — solo stdout nivel info; `docker compose logs -f backend` |
