#!/usr/bin/env bash
# ============================================
# Desplegar TODO Lux Viajes (backend + frontend)
# Uso: ./scripts/deploy-all.sh
# Orquesta los dos composes (backend/ y frontend/)
# ============================================
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Creando red compartida (si no existe)"
docker network create luxviajes-network 2>/dev/null || true

echo ""
echo "########## BACKEND (postgres + API) ##########"
(cd backend && ./scripts/deploy.sh)

echo ""
echo "########## FRONTEND (Next.js) ##########"
(cd frontend && docker compose -f docker-compose.prod.yml up -d --build)

echo ""
echo "==> Estado de los contenedores"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=luxviajes"

echo ""
echo "==> Verificación"
echo "Backend health: $(curl -s http://localhost:3001/health || echo 'FALLO')"
echo "Frontend:       $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000 || echo 'FALLO')"

echo ""
echo "✅ Despliegue completo."
