#!/bin/sh
set -e

# Railway provides PORT env variable - update nginx config to use it
LISTEN_PORT="${PORT:-80}"
echo "Starting MSiT AI Assistant on port $LISTEN_PORT"

# Update nginx to listen on Railway's PORT
sed -i "s/listen 80;/listen $LISTEN_PORT;/" /etc/nginx/http.d/default.conf

# Create proper supervisor config with newlines
cat > /etc/supervisord.conf << 'EOF'
[supervisord]
nodaemon=true
user=root
logfile=/dev/null
logfile_maxbytes=0
pidfile=/tmp/supervisord.pid

[program:backend]
command=node /app/backend/dist/server.js
directory=/app/backend
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
startsecs=5
startretries=3

[program:nginx]
command=nginx -g "daemon off;"
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
startsecs=2
startretries=3
EOF

# Export environment variables for backend
export NODE_ENV=production
export BACKEND_PORT=3001

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisord.conf
