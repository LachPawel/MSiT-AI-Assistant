#!/bin/sh
set -e

# Railway provides PORT env variable - update nginx config to use it
LISTEN_PORT="${PORT:-80}"
echo "========================================="
echo "Starting MSiT AI Assistant"
echo "========================================="
echo "PORT: $LISTEN_PORT"
echo "NODE_ENV: ${NODE_ENV:-production}"
echo "SUPABASE_URL: ${SUPABASE_URL:+set}"
echo "OPENAI_API_KEY: ${OPENAI_API_KEY:+set}"
echo "========================================="

# Update nginx to listen on Railway's PORT
sed -i "s/listen 80;/listen $LISTEN_PORT;/" /etc/nginx/http.d/default.conf

# Create proper supervisor config with environment variables
cat > /etc/supervisord.conf << EOF
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
environment=NODE_ENV="production",PORT="3001",SUPABASE_URL="${SUPABASE_URL}",SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY}",SUPABASE_SERVICE_KEY="${SUPABASE_SERVICE_KEY}",OPENAI_API_KEY="${OPENAI_API_KEY}",EXA_API_KEY="${EXA_API_KEY}"

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

echo "Starting supervisord..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
