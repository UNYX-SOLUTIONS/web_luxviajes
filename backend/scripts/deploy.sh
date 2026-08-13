#!/usr/bin/env bash
# ============================================
# Deploy backend Lux Viajes en Hostinger VPS
# Uso: ./scripts/deploy.sh  (desde backend/)
# ============================================
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Verificando archivo .env"
if [ ! -f .env ]; then
  echo "❌ No existe .env. Cópialo desde .env.docker.example y llena los valores."
  exit 1
fi

echo "==> Creando red compartida (si no existe)"
docker network create luxviajes-network 2>/dev/null || true

echo "==> Descargando últimos cambios (git)"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git pull --ff-only || echo "⚠️ git pull falló, continuando con el código local"
fi

echo "==> Construyendo imagen del backend"
docker compose build --no-cache backend

echo "==> Levantando servicios"
docker compose up -d

echo "==> Estado de los contenedores"
docker compose ps

echo "==> Logs recientes del backend"
docker compose logs --tail=30 backend

echo "==> Limpiando imágenes viejas"
docker image prune -f

echo "✅ Deploy completado. Health check: http://localhost:3001/health"
