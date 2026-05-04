# Despliegue en Hostinger VPS con Docker

## Opción A: Deployment con Docker (Recomendado)

### 1. Preparar el servidor

```bash
# Conectar vía SSH a tu VPS Hostinger
ssh root@tu-ip-vps

# Actualizar el sistema
apt update && apt upgrade -y

# Instalar Docker y Docker Compose
apt install -y docker.io docker-compose-plugin curl

# Iniciar Docker
systemctl start docker
systemctl enable docker

# Verificar instalación
docker --version
docker compose version
```

### 2. Preparar el proyecto en el servidor

```bash
# Crear directorio para la aplicación
mkdir -p /var/www/luxviajes
cd /var/www/luxviajes

# Clonar el repositorio o copiar archivos
# Opción 1: Clonar directamente
git clone https://tu-repositorio.git .

# Opción 2: Copiar vía SFTP/FTP
# Copia los archivos a /var/www/luxviajes
```

### 3. Configurar variables de entorno

```bash
# Crear archivo .env.local
nano .env/local

# Agregar las variables necesarias:
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://tu-api.luxviajes.com
NEXT_PUBLIC_BASE_URL=https://luxviajes.com

# Guardar: Ctrl+O, Enter, Ctrl+X
```

### 4. Construir e iniciar con Docker Compose

```bash
# Desde /var/www/luxviajes
cd frontend

# Construir la imagen
docker compose build

# Iniciar el contenedor en background
docker compose up -d

# Verificar que está corriendo
docker compose ps
docker compose logs -f luxviajes-app
```

### 5. Configurar Nginx como proxy inverso

```bash
# Instalar Nginx
apt install -y nginx

# Crear configuración
nano /etc/nginx/sites-available/luxviajes

# Agregar esta configuración:
```

```nginx
upstream nextjs {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name luxviajes.com www.luxviajes.com;

    # Redirigir a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name luxviajes.com www.luxviajes.com;

    # Certificados SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/luxviajes.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/luxviajes.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    client_max_body_size 20M;

    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
    }

    # Cache estático (images, css, js)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://nextjs;
        proxy_cache_valid 200 60d;
        proxy_cache_bypass $http_pragma $http_authorization;
        add_header Cache-Control "public, max-age=31536000, immutable";
        expires 1y;
    }

    # Denegar acceso a archivos sensibles
    location ~ /\. {
        deny all;
    }
}
```

```bash
# Habilitar la configuración
ln -s /etc/nginx/sites-available/luxviajes /etc/nginx/sites-enabled/

# Verificar sintaxis
nginx -t

# Recargar Nginx
systemctl reload nginx
systemctl enable nginx
```

### 6. Configurar SSL con Let's Encrypt

```bash
# Instalar Certbot
apt install -y certbot python3-certbot-nginx

# Obtener certificado
certbot certonly --nginx -d luxviajes.com -d www.luxviajes.com

# Renovación automática (ya está configurada)
systemctl status certbot.timer
```

### 7. Monitoreo y Logs

```bash
# Ver logs de la aplicación
docker compose logs -f luxviajes-app

# Ver logs de Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Verificar estado del contenedor
docker ps
docker stats luxviajes-app
```

---

## Opción B: Deployment Sin Docker (Alternativa)

### 1. Preparar servidor Node.js

```bash
# Instalar Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Instalar pnpm globalmente
npm install -g pnpm

# Crear usuario para la aplicación
useradd -m -s /bin/bash luxviajes
```

### 2. Clonar y configurar aplicación

```bash
# Crear directorio
mkdir -p /var/www/luxviajes
cd /var/www/luxviajes

# Clonar repositorio
git clone https://tu-repositorio.git .
cd frontend

# Instalar dependencias
pnpm install --frozen-lockfile

# Build
pnpm build

# Configurar permisos
chown -R luxviajes:luxviajes /var/www/luxviajes
```

### 3. Crear servicio systemd

```bash
# Crear archivo de servicio
nano /etc/systemd/system/luxviajes.service
```

```ini
[Unit]
Description=Luxviajes Next.js Application
After=network.target

[Service]
Type=simple
User=luxviajes
WorkingDirectory=/var/www/luxviajes/frontend
ExecStart=/home/luxviajes/.local/share/pnpm/pnpm start
Restart=always
RestartSec=10
Environment="NODE_ENV=production"
Environment="PORT=3000"

[Install]
WantedBy=multi-user.target
```

```bash
# Activar servicio
systemctl daemon-reload
systemctl start luxviajes
systemctl enable luxviajes

# Verificar estado
systemctl status luxviajes
```

---

## Tareas de Mantenimiento

### Actualizar la aplicación

```bash
cd /var/www/luxviajes

# Con Docker
docker compose down
git pull origin main
docker compose build
docker compose up -d

# Sin Docker
git pull origin main
cd frontend
pnpm install
pnpm build
systemctl restart luxviajes
```

### Backup

```bash
# Crear backup de la aplicación
tar -czf luxviajes-backup-$(date +%Y%m%d).tar.gz /var/www/luxviajes

# Crear backup de la BD (si aplica)
# mysqldump -u usuario -p basedatos > backup.sql
```

### Monitoreo de recursos

```bash
# Instalar htop para monitoreo
apt install -y htop
htop

# Con Docker
docker stats luxviajes-app

# Ver uso de disco
df -h
```

---

## Troubleshooting

### Contenedor no inicia

```bash
# Revisar logs detallados
docker compose logs luxviajes-app

# Verificar imagen
docker images

# Reconstruir imagen
docker compose build --no-cache
```

### Proxy reverso no funciona

```bash
# Verificar Nginx
nginx -t
systemctl status nginx

# Verificar puertos
netstat -tlpn | grep 3000
netstat -tlpn | grep 80
```

### Out of memory

```bash
# Aumentar límites en docker-compose.yml
# Ver sección "deploy.resources.limits"

# Reiniciar contenedor
docker compose restart
```

## Archivos generados por el build:

```
.next/
├── cache/
├── server/
├── static/
└── BUILD_ID
```

Estos archivos son lo que Next.js necesita para servir la aplicación en producción.

## Comandos útiles en Hostinger (vía SSH):

```bash
# Instalar dependencias
pnpm install

# Generar build
pnpm build

# Iniciar en producción (si necesitas hacerlo manual)
pnpm start

# Ver logs
tail -f /var/log/node.log
```

## Recomendaciones:

1. **Reverse Proxy**: Hostinger puede configurar nginx como reverse proxy
2. **SSL**: Usa certificados Let's Encrypt (gratuito en Hostinger)
3. **Monitoreo**: Habilita alerts de caída de la aplicación
4. **Backups**: Configura backups automáticos
5. **Environment**: Usa un archivo `.env.production.local` para variables de producción

## Tamaño del build:

El build de Next.js optimizado ocupa aproximadamente:

- **.next/**: ~100MB (depende de tus assets)
- **node_modules/**: ~500MB (se puede comprimir)

---

**Fecha de generación**: ${new Date().toLocaleString('es-ES')}
**Versión de Next.js**: 16.2.3
