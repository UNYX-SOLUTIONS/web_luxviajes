#!/bin/sh
set -e

echo "🚀 Iniciando backend Lux Viajes..."

if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "⏳ Aplicando migraciones de Prisma..."
  n=0
  until npx prisma migrate deploy; do
    n=$((n + 1))
    if [ "$n" -ge 10 ]; then
      echo "❌ No se pudo conectar a PostgreSQL tras $n intentos."
      exit 1
    fi
    echo "↻ PostgreSQL no listo. Reintentando en 5s... ($n/10)"
    sleep 5
  done
  echo "✅ Migraciones aplicadas."
else
  echo "ℹ️ RUN_MIGRATIONS no es 'true'. Omitiendo migraciones."
fi

echo "✅ Iniciando servidor en el puerto ${PORT:-3001}..."
exec node dist/server.js
