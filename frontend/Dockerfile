# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar archivos de lockfile primero para aprovechar cache
COPY package.json pnpm-lock.yaml ./

# Instalar todas las dependencias (incluyendo dev)
RUN pnpm install --frozen-lockfile

# Copiar el código fuente
COPY . .

# Build de Next.js
RUN pnpm build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copiar package.json y pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Instalar solo dependencias de producción
RUN pnpm install --frozen-lockfile --production && pnpm cache clean

# Copiar public directory
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copiar .next compilado
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Environment variables por defecto
ENV NODE_ENV=production \
    PORT=3000

# Health check mejorado
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Comando de inicio
CMD ["pnpm", "start"]
