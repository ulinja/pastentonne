# syntax=docker/dockerfile:1

FROM alpine:latest

ARG TIMEZONE
ENV TIMEZONE=${TIMEZONE:?error}

RUN apk add --no-cache \
    caddy \
    nodejs \
    npm \
    supervisor \
    tzdata

RUN cp "/usr/share/zoneinfo/${TIMEZONE}" /etc/localtime && \
    echo ${TIMEZONE:?error} > /etc/timezone

COPY docker/app.Caddyfile /app/Caddyfile
COPY docker/app.supervisord.conf /app/supervisord.conf
COPY --chmod=744 docker/app.entrypoint.sh /app/entrypoint.sh
COPY * /app

WORKDIR /app
RUN npm install && nuxt build
EXPOSE 8080
ENTRYPOINT ["/app/entrypoint.sh"]
