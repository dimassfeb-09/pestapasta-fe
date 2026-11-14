# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_MODE=production
ARG VITE_ENDPOINT_BACKEND_LOCAL=http://localhost:8081
ARG VITE_ENDPOINT_BACKEND_PRODUCTION=http://localhost:8081
ENV VITE_API_MODE=${VITE_API_MODE}
ENV VITE_ENDPOINT_BACKEND_LOCAL=${VITE_ENDPOINT_BACKEND_LOCAL}
ENV VITE_ENDPOINT_BACKEND_PRODUCTION=${VITE_ENDPOINT_BACKEND_PRODUCTION}
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]