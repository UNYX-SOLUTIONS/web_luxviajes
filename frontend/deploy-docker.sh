#!/bin/bash

#########################################
# Script de Deployment para Docker en Hostinger VPS
# Uso: ./deploy-docker.sh
#########################################

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Deployment Lux Viajes - Docker${NC}"
echo -e "${YELLOW}========================================${NC}"

# Variables
PROJECT_PATH="/var/www/luxviajes"
BRANCH="${1:-main}"
DOCKER_REGISTRY="${2:-luxviajes}"

# 1. Verificar si estamos en el directorio correcto
if [ ! -d "$PROJECT_PATH" ]; then
    echo -e "${RED}Error: El directorio $PROJECT_PATH no existe${NC}"
    exit 1
fi

cd "$PROJECT_PATH"
echo -e "${GREEN}✓ Navegando a $PROJECT_PATH${NC}"

# 2. Actualizar código desde repositorio
echo -e "${YELLOW}\n📦 Actualizando código...${NC}"
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH
echo -e "${GREEN}✓ Código actualizado${NC}"

# 3. Ir al directorio frontend
cd frontend
echo -e "${GREEN}✓ Navegando a frontend${NC}"

# 4. Detener contenedor actual
echo -e "${YELLOW}\n🛑 Deteniendo contenedor anterior...${NC}"
docker compose down --remove-orphans || true
echo -e "${GREEN}✓ Contenedor detenido${NC}"

# 5. Construir imagen Docker
echo -e "${YELLOW}\n🔨 Construyendo imagen Docker...${NC}"
docker compose build --no-cache
echo -e "${GREEN}✓ Imagen construida exitosamente${NC}"

# 6. Iniciar nuevos contenedores
echo -e "${YELLOW}\n🚀 Iniciando aplicación...${NC}"
docker compose up -d
echo -e "${GREEN}✓ Aplicación iniciada${NC}"

# 7. Esperar a que la aplicación esté lista
echo -e "${YELLOW}\n⏳ Esperando a que la aplicación esté lista...${NC}"
sleep 10

# 8. Verificar salud
if docker compose ps | grep -q "luxviajes-app"; then
    echo -e "${GREEN}✓ Contenedor está corriendo${NC}"
    
    # Esperar healthcheck
    for i in {1..30}; do
        if curl -s http://localhost:3000 > /dev/null; then
            echo -e "${GREEN}✓ Aplicación está respondiendo${NC}"
            break
        fi
        echo -n "."
        sleep 2
    done
else
    echo -e "${RED}✗ Error: Contenedor no está corriendo${NC}"
    docker compose logs luxviajes-app
    exit 1
fi

# 9. Limpiar
echo -e "${YELLOW}\n🧹 Limpiando recursos antiguos...${NC}"
docker image prune -f --filter "until=24h"
echo -e "${GREEN}✓ Limpieza completada${NC}"

# 10. Mostrar resumen
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Deployment completado exitosamente!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\n📊 Estado de la aplicación:"
docker compose ps
echo -e "\n📝 Logs recientes:"
docker compose logs --tail=10 luxviajes-app

echo -e "\n${GREEN}La aplicación está disponible en: http://luxviajes.com${NC}"
