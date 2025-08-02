# Pastentonne

A dead simple pastebin.

## Setup

Create a `.env` file in the project root by copying the supplied `.env.example` file:

```bash
cp -i .env.example .env
```

Make sure to cusomize the environment variables to suit your needs:

| Environment Variable | Description                                  | Example Value |
|----------------------|----------------------------------------------|---------------|
| TIMEZONE             | Name of the host's local timezone            | Europe/Berlin |
| UID                  | Unix user ID of the container user           | 1000          |
| GID                  | Unix group ID of the container user          | 1000          |
| NUXT_DATA_DIR        | Pastentonne data folder inside the container | /data/app     |

Make sure that you bind `$NUXT_DATA_DIR` as a volume on your Docker host and that `$UID:$GID`
has read/write access to this directory. Otherwise, paste data will not persist across container restarts.

## Production

Build and run the application for production:

```bash
docker compose -f docker/app.docker-compose.yml --env-file .env up --build --force-recreate --remove-orphans
```

## Development

To start development, make sure to install dependencies locally on your host:

```bash
npm install
```

Start the development docker stack on `http://localhost:8000`:

```bash
docker compose -f docker/app.docker-compose.yml -f docker/app.dev.override.docker-compose.yml --env-file .env up --build --force-recreate --remove-orphans
```
