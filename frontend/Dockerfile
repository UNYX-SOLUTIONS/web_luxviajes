# Docker para ejecutar la carpeta 'deploy' pre-compilada
FROM node:20-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar todo desde la carpeta deploy
COPY deploy/ .

# Instalar dependencias de producción
RUN pnpm install --frozen-lockfile --production

# Usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
USER nextjs

# Puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Comando de inicio
CMD ["pnpm", "start"]
