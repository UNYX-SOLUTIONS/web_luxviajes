#!/usr/bin/env bash
# Cheat Sheet: Comandos Docker para Luxviajes
# Usar como referencia rápida

# ============================================
# COMANDOS BÁSICOS
# ============================================

# Construir imagen
docker compose build

# Construir sin cache
docker compose build --no-cache

# Iniciar contenedores
docker compose up

# Iniciar en background
docker compose up -d

# Detener contenedores
docker compose down

# Reiniciar
docker compose restart

# ============================================
# LOGS Y MONITOREO
# ============================================

# Ver logs en tiempo real
docker compose logs -f

# Ver últimas 50 líneas
docker compose logs --tail=50

# Ver logs desde hace 10 minutos
docker compose logs --since 10m

# Ver logs de un servicio específico
docker compose logs -f luxviajes-app

# ============================================
# VERIFICACIÓN DE ESTADO
# ============================================

# Ver contenedores corriendo
docker compose ps

# Ver recursos usados
docker stats luxviajes-app

# Ver información del contenedor
docker compose exec luxviajes-app whoami

# Verificar puerto
curl http://localhost:3000

# ============================================
# ENTRADA AL CONTENEDOR
# ============================================

# Entrar al contenedor (bash)
docker compose exec luxviajes-app sh

# Ejecutar comando
docker compose exec luxviajes-app ls -la

# ============================================
# LIMPIEZA
# ============================================

# Eliminar contenedores parados
docker container prune -f

# Eliminar imágenes sin usar
docker image prune -f

# Eliminar volúmenes sin usar
docker volume prune -f

# Limpiar todo (cuidado!)
docker system prune -a

# ============================================
# DEPLOYMENT
# ============================================

# Actualizar y redeployar
git pull origin main
docker compose down
docker compose build --no-cache
docker compose up -d

# O usar script automático
./deploy-docker.sh main

# ============================================
# VARIABLES DE ENTORNO
# ============================================

# Ver variables de entorno del contenedor
docker compose exec luxviajes-app env | grep NEXT

# Editar variables (en .env.local)
nano .env.local

# Recargar variables
docker compose down
docker compose up -d

# ============================================
# NETWORK & CONNECTIVITY
# ============================================

# Ver redes de Docker
docker network ls

# Ver contenedores en red
docker network inspect luxviajes_luxviajes-network

# Conectar a red
docker network connect <network-id> <container-id>

# ============================================
# VOLÚMENES
# ============================================

# Listar volúmenes
docker volume ls

# Inspeccionar volumen
docker volume inspect <volume-name>

# Crear volumen
docker volume create <name>

# ============================================
# IMÁGENES
# ============================================

# Listar imágenes locales
docker images

# Ver tamaño de imagen
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Etiquetear imagen
docker tag luxviajes:latest luxviajes:1.0

# Buscar en Docker Hub
docker search node

# ============================================
# DIAGNOSTIC
# ============================================

# Inspeccionar contenedor
docker compose exec luxviajes-app ps aux

# Ver historial de comandos
history

# Verificar sintaxis docker-compose
docker compose config

# Validar Dockerfile
docker build --dry-run .

# ============================================
# DESARROLLO LOCAL
# ============================================

# Modo desarrollo (con recarga en vivo)
docker compose up  # Sin -d para ver logs

# Acceder a pnpm dentro del contenedor
docker compose exec luxviajes-app pnpm --version

# Instalar paquete
docker compose exec luxviajes-app pnpm add <package>

# ============================================
# BACKUP & RESTORE
# ============================================

# Backup del volumen
docker run --rm -v luxviajes_luxviajes-network:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data

# Restore del volumen
docker run --rm -v luxviajes_luxviajes-network:/data -v $(pwd):/backup alpine tar xzf /backup/backup.tar.gz -C /

# ============================================
# SSH AL VPS
# ============================================

# Conectar al VPS
ssh root@tu-ip-vps

# Con puerto personalizado
ssh -p 22 root@tu-ip-vps

# Copiar archivos local a VPS
scp -r ./frontend root@tu-ip-vps:/var/www/luxviajes/

# Copiar de VPS a local
scp -r root@tu-ip-vps:/var/www/luxviajes/frontend ./

# ============================================
# NGINX (si está en host)
# ============================================

# Verificar sintaxis
nginx -t

# Recargar configuración
systemctl reload nginx

# Ver logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# ============================================
# CERTIFICADOS SSL (Let's Encrypt)
# ============================================

# Ver certificados
certbot certificates

# Renovar certificado
certbot renew

# Test de renovación automática
certbot renew --dry-run

# ============================================
# UTILIDADES
# ============================================

# Contador de líneas de código
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l

# Encontrar archivos grandes
find . -type f -size +10M

# Eliminar archivos node_modules
find . -name node_modules -type d -prune -exec rm -rf {} + 2>/dev/null

# ============================================
# REFERENCIAS RÁPIDAS
# ============================================

# Más info sobre docker compose
docker compose --help
docker compose logs --help
docker compose exec --help

# Más info sobre Docker
docker --help
docker run --help
docker build --help

# ============================================
# ALIAS ÚTILES (Agregar a ~/.bashrc)
# ============================================

# alias dl='docker compose logs -f'
# alias dps='docker compose ps'
# alias dupd='docker compose down && docker compose build --no-cache && docker compose up -d'
# alias dexec='docker compose exec luxviajes-app'
# alias dclean='docker container prune -f && docker image prune -f && docker volume prune -f'

# ============================================
# ATAJOS RÁPIDOS
# ============================================

# Deployar cambios
git pull && docker compose down && docker compose build && docker compose up -d && docker compose logs -f

# Ver todo
docker compose ps && echo "---" && docker stats --no-stream

# Monitoreo continuo
watch -n 5 'docker stats --no-stream'
