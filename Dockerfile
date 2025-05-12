# Etapa base con Node para instalación y build
FROM node:18-alpine AS deps

WORKDIR /app

# Copia los archivos de dependencias
COPY package.json package-lock.json* ./

# Instala dependencias con npm
RUN npm ci

# Builder: compila la app
FROM node:18-alpine AS builder

WORKDIR /app

# Copia node_modules y todo el código
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ejecuta el build con npm
RUN npm run build

# Etapa final: runtime con Bun
FROM oven/bun:1 AS runtime

WORKDIR /app

# Copia el resultado del build
COPY --from=builder /app ./

# Expone el puerto y configura entorno
EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

# Ejecuta tu entry point con Bun
CMD ["bun", "./hono-entry.ts"]
