# ====================================
# Stage 1: Builder - Compilar TypeScript y generar Prisma Client
# ====================================
FROM node:20-alpine AS builder

WORKDIR /app

# Prisma engines requieren openssl + compatibilidad libc en alpine
RUN apk add --no-cache openssl libc6-compat

COPY package.json ./

# El repo aún no tiene package-lock.json; se instala y se recomienda
# generar el lockfile para builds reproducibles (ver DOCKER_DEPLOY.md)
RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# Generar el cliente de Prisma y compilar
RUN npx prisma generate
RUN npm run build

# ====================================
# Stage 2: Runtime - Imagen mínima de producción
# ====================================
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat dumb-init

# Usuario sin privilegios (seguridad)
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

# Código compilado y cliente de Prisma generado (debe coincidir con el schema)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Schema + migraciones para `prisma migrate deploy` en el entrypoint
COPY prisma ./prisma
COPY entrypoint.sh ./entrypoint.sh

RUN chown -R nodejs:nodejs /app && chmod +x /app/entrypoint.sh

USER nodejs

EXPOSE 3001

ENV NODE_ENV=production \
    PORT=3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => { if (r.statusCode !== 200) throw new Error(r.statusCode) })" || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/app/entrypoint.sh"]
