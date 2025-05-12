# Base image with Node + pnpm
FROM node:18-alpine AS deps

WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar solo archivos necesarios para instalación
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Builder stage (compila con Node)
FROM node:18-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Compilar
RUN pnpm run build

# Final runtime image con Bun
FROM oven/bun:1 AS runtime

WORKDIR /app
COPY --from=builder /app ./

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

# Ejecutar la app con Bun
CMD ["bun", "./hono-entry.ts"]
