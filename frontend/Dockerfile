# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy all configuration files
COPY frontend/tsconfig*.json ./
COPY frontend/vite.config.ts .
COPY frontend/postcss.config.js .
COPY frontend/tailwind.config.js .

# Copy source and public files
COPY frontend/index.html .
COPY frontend/src ./src
COPY frontend/public ./public

# Build application - use Vite directly bypassing vue-tsc
RUN npx vite build

# Runtime stage - use nginx for production
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
RUN echo 'server { \
  listen 80; \
  location / { \
    root /usr/share/nginx/html; \
    try_files $uri $uri/ /index.html; \
  } \
  location /api/ { \
    proxy_pass http://backend:3001; \
  } \
}' > /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
