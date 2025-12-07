# Multi-stage build for MSiT AI Assistant (Backend + Frontend)
# This Dockerfile builds both services and runs them with nginx as reverse proxy

# ========================================
# Stage 1: Build Backend
# ========================================
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy backend source and config
COPY backend/tsconfig.json ./
COPY backend/src ./src

# Build TypeScript
RUN npm run build

# ========================================
# Stage 2: Build Frontend
# ========================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend configuration
COPY frontend/tsconfig*.json ./
COPY frontend/vite.config.ts ./
COPY frontend/postcss.config.js ./
COPY frontend/tailwind.config.js ./
COPY frontend/index.html ./

# Copy source files
COPY frontend/src ./src
COPY frontend/public ./public

# Build frontend
RUN npx vite build

# ========================================
# Stage 3: Production Runtime
# ========================================
FROM node:20-alpine AS runtime

# Install nginx and supervisor
RUN apk add --no-cache nginx supervisor dumb-init

WORKDIR /app

# Copy backend production files
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

COPY --from=backend-builder /app/backend/dist ./backend/dist

# Copy frontend built files
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Create nginx configuration
RUN mkdir -p /etc/nginx/http.d && \
    echo 'server { \
    listen 80; \
    server_name _; \
    \
    # Frontend - serve static files \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Backend API proxy \
    location /api/ { \
        proxy_pass http://127.0.0.1:3001/api/; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
        proxy_read_timeout 300s; \
        proxy_connect_timeout 75s; \
    } \
    \
    # Health check endpoint \
    location /health { \
        proxy_pass http://127.0.0.1:3001/health; \
    } \
}' > /etc/nginx/http.d/default.conf

# Remove default nginx config that might conflict
RUN rm -f /etc/nginx/conf.d/default.conf 2>/dev/null || true

# Expose port (Railway uses PORT env variable, defaults to 80)
EXPOSE 80
EXPOSE 3001

# Copy startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT:-80}/health || exit 1

# Start application
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/app/start.sh"]
