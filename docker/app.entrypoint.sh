#!/bin/sh

NITRO_PORT="3000"
NITRO_HOST="localhost"
mkdir -p /var/log/app/
exec supervisord -n -c /app/supervisord.conf
