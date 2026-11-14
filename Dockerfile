# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the source
COPY . .

# Build-time configuration
ARG VITE_API_MODE=production
ARG VITE_ENDPOINT_BACKEND_LOCAL=/api
ARG VITE_ENDPOINT_BACKEND_PRODUCTION=/api
ENV VITE_API_MODE=${VITE_API_MODE}
ENV VITE_ENDPOINT_BACKEND_LOCAL=${VITE_ENDPOINT_BACKEND_LOCAL}
ENV VITE_ENDPOINT_BACKEND_PRODUCTION=${VITE_ENDPOINT_BACKEND_PRODUCTION}

RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Basic healthcheck using busybox wget available in nginx:alpine
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]