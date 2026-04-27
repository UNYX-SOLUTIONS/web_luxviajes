# Stage 1: Builder - Compilar Next.js
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar solo archivos de dependencias (mejor caching)
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias (incluyendo dev)
RUN pnpm install --frozen-lockfile

# Copiar todo el código fuente
COPY . .

# Build de Next.js
RUN pnpm build

# ====================================
# Stage 2: Runtime - Ejecutar aplicación
# ====================================
FROM node:20-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Crear usuario no-root (seguridad)
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copiar archivos de dependencias
COPY --chown=nextjs:nodejs package.json pnpm-lock.yaml ./

# Instalar solo dependencias de producción
RUN pnpm install --frozen-lockfile --production

# Limpiar caché
RUN pnpm store prune

# Copiar directorio public desde builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copiar build de Next.js (.next) desde builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Copiar next.config.ts si existe (para runtime)
COPY --chown=nextjs:nodejs next.config.ts* ./

# Cambiar a usuario sin privilegios
USER nextjs

# Exponer puerto
EXPOSE 3000

# Configurar variables de entorno
ENV NODE_ENV=production \
    PORT=3000

# Health check - Verificar que la app responde
HEALTHCHECK --interval=30s --timeout=10s --start-period=45s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Comando de inicio
CMD ["pnpm", "start"]
