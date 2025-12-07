#!/bin/sh

# Railway provides PORT env variable - update nginx config to use it
if [ -n "$PORT" ]; then
    sed -i "s/listen 80;/listen $PORT;/" /etc/nginx/http.d/default.conf
fi

# Start supervisor which manages both nginx and backend
exec supervisord -c /etc/supervisord.conf
