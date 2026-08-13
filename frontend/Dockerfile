# Stage 1: Builder - Compilar Next.js
FROM node:20-alpine AS builder

WORKDIR /app

# openssl requerido por Prisma para generar el cliente
RUN apk add --no-cache openssl libc6-compat

# Instalar pnpm
RUN npm install -g pnpm

# Copiar solo archivos de dependencias (mejor caching)
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias (incluyendo dev)
RUN pnpm install --frozen-lockfile

# Copiar todo el código fuente (incluye prisma/schema.prisma)
COPY . .

# Variables build-time: NEXT_PUBLIC_* se incrustan en el cliente;
# PAYMENTS_BACKEND_URL es solo servidor (no llega al navegador)
ARG NEXT_PUBLIC_NODE_ENV
ARG NEXT_PUBLIC_DATAFAST_BASE_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BASE_URL
ARG PAYMENTS_BACKEND_URL
ENV NEXT_PUBLIC_NODE_ENV=$NEXT_PUBLIC_NODE_ENV \
    NEXT_PUBLIC_DATAFAST_BASE_URL=$NEXT_PUBLIC_DATAFAST_BASE_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL \
    PAYMENTS_BACKEND_URL=$PAYMENTS_BACKEND_URL

# Generar Prisma Client (requerido para typecheck y runtime)
RUN pnpm exec prisma generate

# Build de Next.js
RUN pnpm build

# ====================================
# Stage 2: Runtime - Ejecutar aplicación
# ====================================
FROM node:20-alpine

WORKDIR /app

# openssl requerido por el query engine de Prisma en runtime
RUN apk add --no-cache openssl libc6-compat

# Instalar pnpm
RUN npm install -g pnpm

# Crear usuario no-root (seguridad)
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copiar archivos de dependencias y schema ANTES de instalar
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Instalar todas las dependencias (necesario para prisma generate)
RUN pnpm install --frozen-lockfile

# Generar Prisma Client en el runtime
RUN pnpm exec prisma generate

# Quitar dependencias de desarrollo (imagen más liviana)
RUN pnpm prune --prod

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
