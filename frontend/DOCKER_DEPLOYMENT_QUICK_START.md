# 🚀 Quick Start: Docker Deployment en Hostinger VPS

## Resumen Rápido

Tu proyecto ya está configurado con:
- ✅ **Dockerfile** optimizado con multi-stage build
- ✅ **docker-compose.yml** configurado para producción
- ✅ **Scripts de deployment** automático
- ✅ **Configuración Nginx** como proxy inverso

---

## 5 Pasos Rápidos para Deployer

### 1️⃣ Conectar al VPS (SSH)

```bash
ssh root@tu-ip-vps
# Ingresa tu contraseña
```

### 2️⃣ Instalar Docker (Primera vez solo)

```bash
apt update && apt upgrade -y
apt install -y docker.io docker-compose-plugin git curl
systemctl start docker && systemctl enable docker
```

### 3️⃣ Clonar y Configurar Proyecto

```bash
cd /var/www
git clone https://tu-repo-github.com/web_luxviajes.git
cd web_luxviajes/frontend

# Crear archivo .env.local (copiar desde .env.production.example)
cp .env.production.example .env.local
nano .env.local
# Editar valores y guardar (Ctrl+O, Enter, Ctrl+X)
```

### 4️⃣ Iniciar con Docker Compose

```bash
# Construir y ejecutar
docker compose build
docker compose up -d

# Verificar que esté corriendo
docker compose ps
docker compose logs -f
```

### 5️⃣ Configurar Nginx (Dominio + SSL)

```bash
# Instalar Nginx
apt install -y nginx certbot python3-certbot-nginx

# Crear configuración (ver archivo nginx-config.conf)
nano /etc/nginx/sites-available/luxviajes
# Pegar configuración y guardar

# Habilitar configuración
ln -s /etc/nginx/sites-available/luxviajes /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Obtener certificado SSL gratis
certbot certonly --nginx -d luxviajes.com -d www.luxviajes.com
```

---

## Scripts de Deployment

### Opción A: Usar Script Automático (Recomendado)

```bash
# Hacer script ejecutable
chmod +x /var/www/web_luxviajes/frontend/deploy-docker.sh

# Ejecutar deployment
cd /var/www/web_luxviajes/frontend
./deploy-docker.sh main

# O especificar rama diferente
./deploy-docker.sh desarrollo
```

### Opción B: Comandos Manuales

```bash
cd /var/www/web_luxviajes/frontend

# Actualizar código
git pull origin main

# Reconstruir e reiniciar
docker compose down
docker compose build
docker compose up -d

# Verificar
docker compose logs -f
```

---

## Monitoreo & Troubleshooting

### Ver logs en tiempo real
```bash
docker compose logs -f luxviajes-app
```

### Ver recursos del contenedor
```bash
docker stats luxviajes-app
```

### Verificar que el puerto 3000 está abierto
```bash
curl http://localhost:3000
```

### Reiniciar aplicación
```bash
docker compose restart
```

### Detener aplicación
```bash
docker compose down
```

---

## Variables de Entorno Importantes

Editar en `.env.local`:

```bash
# Estos DEBEN configurarse en tu VPS:
NEXT_PUBLIC_BASE_URL=https://luxviajes.com
NEXT_PUBLIC_API_URL=https://api.luxviajes.com

# Otros según tu aplicación
NODE_ENV=production
PORT=3000
```

---

## URLs y Puertos

| Servicio | URL | Puerto |
|----------|-----|--------|
| App (Docker) | http://localhost:3000 | 3000 |
| Nginx | http://tu-dominio.com | 80/443 |
| SSH | ssh://root@tu-ip | 22 |

---

## Checklist Pre-Deployment

- [ ] Dominio apuntando a IP del VPS
- [ ] Docker instalado en VPS
- [ ] Repositorio clonado en `/var/www/web_luxviajes`
- [ ] `.env.local` configurado con variables correctas
- [ ] Certificado SSL instalado (Let's Encrypt)
- [ ] Nginx configurado como proxy inverso
- [ ] Puertos 80, 443 abiertos en firewall
- [ ] Docker contenedor corriendo: `docker ps`

---

## Soporte y Referencia

- 📖 Documentación completa: [HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md)
- 🐳 Docker Hub: [node:20-alpine](https://hub.docker.com/_/node)
- 🔒 Let's Encrypt: [certbot.eff.org](https://certbot.eff.org/)
- 📚 Next.js: [nextjs.org/docs](https://nextjs.org/docs)

---

## Próximos Pasos

1. **Backup automático**: Configurar cron job para backups diarios
2. **Monitoreo**: Instalar Prometheus/Grafana para métricas
3. **CI/CD**: Integrar GitHub Actions para deployments automáticos
4. **CDN**: Agregar Cloudflare para caché y DDoS protection

