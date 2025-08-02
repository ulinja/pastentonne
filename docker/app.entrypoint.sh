#!/bin/sh

exec supervisord -n -c /app/supervisord.conf
