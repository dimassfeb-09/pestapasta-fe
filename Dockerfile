# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the source
COPY . .

# Build-time configuration (all via env)
ARG VITE_API_BASE_URL
ARG VITE_API_MODE=production
ARG VITE_ENDPOINT_BACKEND_LOCAL=/api
ARG VITE_ENDPOINT_BACKEND_PRODUCTION=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_MODE=${VITE_API_MODE}
ENV VITE_ENDPOINT_BACKEND_LOCAL=${VITE_ENDPOINT_BACKEND_LOCAL}
ENV VITE_ENDPOINT_BACKEND_PRODUCTION=${VITE_ENDPOINT_BACKEND_PRODUCTION}

RUN npm run build

# Serve stage (no nginx) - static files + SPA fallback
FROM node:20-alpine
WORKDIR /app

ENV PORT=3000
ENV HOST=0.0.0.0

COPY --from=builder /app/dist ./dist
COPY server.mjs ./server.mjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/ >/dev/null 2>&1 || exit 1

CMD ["node", "server.mjs"]