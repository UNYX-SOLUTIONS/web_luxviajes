#!/bin/bash

set -e

PROJECT_DIR="/docker/web_luxviajes"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

echo "======================================"
echo " Luxviajes - Deploy producción"
echo "======================================"

cd "$PROJECT_DIR"

echo ""
echo "[1/7] Actualizando repositorio..."
git pull origin main

echo ""
echo "[2/7] Validando backend..."
cd "$BACKEND_DIR"
docker compose config > /dev/null

echo ""
echo "[3/7] Levantando PostgreSQL..."
docker compose up -d postgres

echo ""
echo "Esperando PostgreSQL..."
for i in {1..30}; do
  STATUS=$(docker inspect \
    --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' \
    luxviajes-postgres 2>/dev/null || true)

  if [ "$STATUS" = "healthy" ]; then
    echo "PostgreSQL healthy."
    break
  fi

  echo "PostgreSQL: $STATUS"
  sleep 2

  if [ "$i" -eq 30 ]; then
    echo "ERROR: PostgreSQL no llegó a estado healthy."
    docker compose logs postgres --tail=100
    exit 1
  fi
done

echo ""
echo "[4/7] Reconstruyendo backend..."
docker compose up -d --build backend

echo ""
echo "[5/7] Validando frontend..."
cd "$FRONTEND_DIR"
docker compose -f docker-compose.prod.yml config > /dev/null

echo ""
echo "[6/7] Reconstruyendo frontend..."
docker compose -f docker-compose.prod.yml up -d --build

echo ""
echo "[7/7] Estado final..."
echo ""

echo "---- BACKEND ----"
cd "$BACKEND_DIR"
docker compose ps

echo ""
echo "---- FRONTEND ----"
cd "$FRONTEND_DIR"
docker compose -f docker-compose.prod.yml ps

echo ""
echo "---- RED LUXVIAJES ----"
docker network inspect luxviajes-network \
  --format='{{range $id, $c := .Containers}}{{$c.Name}}{{println}}{{end}}'

echo ""
echo "======================================"
echo " Deploy terminado"
echo "======================================"