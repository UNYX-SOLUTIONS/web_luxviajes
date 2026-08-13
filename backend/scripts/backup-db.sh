#!/usr/bin/env bash
# ============================================
# Backup PostgreSQL de Lux Viajes
# Uso: ./scripts/backup-db.sh  (desde backend/)
# Programar con cron (ver DOCKER_DEPLOY.md)
# ============================================
set -euo pipefail

cd "$(dirname "$0")/.."

BACKUP_DIR="${BACKUP_DIR:-/root/backups/db}"
DB_USER="${DB_USER:-luxviajes}"
DB_NAME="${DB_NAME:-luxviajes_db}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
DATE="$(date +%Y%m%d_%H%M%S)"

mkdir -p "$BACKUP_DIR"

echo "==> Generando backup de $DB_NAME"
docker compose exec -T postgres pg_dump -U "$DB_USER" -d "$DB_NAME" \
  | gzip > "$BACKUP_DIR/luxviajes_${DATE}.sql.gz"

echo "==> Eliminando backups de más de ${RETENTION_DAYS} días"
find "$BACKUP_DIR" -name 'luxviajes_*.sql.gz' -mtime "+${RETENTION_DAYS}" -delete

echo "✅ Backup creado: $BACKUP_DIR/luxviajes_${DATE}.sql.gz"
