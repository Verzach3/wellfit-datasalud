# Etapa base con Bun Canary (para soporte más experimental pero actualizado)
FROM oven/bun:canary AS base

WORKDIR /app

# Etapa de instalación de dependencias
FROM base AS deps
COPY package.json bun.lockb* bunfig.toml ./

# Limpiar residuos de instalaciones previas si existen
RUN rm -rf node_modules dist .next || true

# Instalar dependencias con bun
RUN bun install --production=false

# Etapa de construcción
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desactivar telemetry opcionalmente
ENV NEXT_TELEMETRY_DISABLED 1

# Construir el proyecto
RUN bun run build

# Imagen final de producción
FROM base AS production
WORKDIR /app

# Copiar solo lo necesario
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/public /app/public
COPY --from=builder /app/hono-entry.ts /app/hono-entry.ts
COPY --from=builder /app/node_modules /app/node_modules

# Configurar variables de entorno
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

EXPOSE 3000

# Comando para iniciar la app
CMD ["bun", "run", "hono-entry.ts"]