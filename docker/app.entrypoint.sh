#!/bin/sh

npm run db:push
exec supervisord -n -c /app/supervisord.conf
