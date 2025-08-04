# syntax=docker/dockerfile:1

FROM alpine:latest

ARG TIMEZONE
ENV TIMEZONE=${TIMEZONE:?error}
ARG UID
ENV UID=${UID:?error}
ARG GID
ENV GID=${GID:?error}
ARG NUXT_DATA_DIR
ENV NUXT_DATA_DIR=${NUXT_DATA_DIR:?error}
ARG NUXT_SESSION_PASSWORD
ENV NUXT_SESSION_PASSWORD=${NUXT_SESSION_PASSWORD:?error}
ARG NUXT_OAUTH_AUTHENTIK_CLIENT_ID
ENV NUXT_OAUTH_AUTHENTIK_CLIENT_ID=${NUXT_OAUTH_AUTHENTIK_CLIENT_ID:?error}
ARG NUXT_OAUTH_AUTHENTIK_CLIENT_SECRET
ENV NUXT_OAUTH_AUTHENTIK_CLIENT_SECRET=${NUXT_OAUTH_AUTHENTIK_CLIENT_SECRET:?error}
ARG NUXT_OAUTH_AUTHENTIK_DOMAIN
ENV NUXT_OAUTH_AUTHENTIK_DOMAIN=${NUXT_OAUTH_AUTHENTIK_DOMAIN:?error}
ARG NUXT_OAUTH_AUTHENTIK_REDIRECT_URL
ENV NUXT_OAUTH_AUTHENTIK_REDIRECT_URL=${NUXT_OAUTH_AUTHENTIK_REDIRECT_URL:?error}

RUN apk add --no-cache \
    caddy \
    nodejs \
    npm \
    supervisor \
    tzdata

RUN cp "/usr/share/zoneinfo/${TIMEZONE}" /etc/localtime && \
    echo ${TIMEZONE:?error} > /etc/timezone

# Create group with $GID (or use existing group if GID is already taken)
RUN (addgroup -g ${GID} pastentonne 2>/dev/null || true) && \
    adduser -u ${UID} -G "$(getent group ${GID} | cut -d: -f1)" -H -D pastentonne
RUN mkdir -p ${NUXT_DATA_DIR} && chown -R ${UID}:${GID} ${NUXT_DATA_DIR}
RUN mkdir /app && chown -R ${UID}:${GID} /app
RUN mkdir -p /var/log/app && chown -R ${UID}:${GID} /var/log/app

COPY --chown=${UID}:${GID}             app /app/app
COPY --chown=${UID}:${GID}             docker/app.Caddyfile /app/Caddyfile
COPY --chown=${UID}:${GID}             docker/app.supervisord.conf /app/supervisord.conf
COPY --chown=${UID}:${GID} --chmod=744 docker/app.entrypoint.sh /app/entrypoint.sh
COPY --chown=${UID}:${GID}             public /app/public
COPY --chown=${UID}:${GID}             server /app/server
COPY --chown=${UID}:${GID}             shared /app/shared
COPY --chown=${UID}:${GID}             components.json /app/components.json
COPY --chown=${UID}:${GID}             nuxt.config.ts /app/nuxt.config.ts
COPY --chown=${UID}:${GID}             package-lock.json /app/package-lock.json
COPY --chown=${UID}:${GID}             package.json /app/package.json
COPY --chown=${UID}:${GID}             tsconfig.json /app/tsconfig.json

USER ${UID}:${GID}
WORKDIR /app
ENV npm_config_cache=/tmp/.npm
RUN npm install && npm run build
EXPOSE 8000
ENTRYPOINT ["/app/entrypoint.sh"]
