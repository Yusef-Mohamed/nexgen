# Development Website Deployment

This repo deploys the `development` branch to:

```text
/home/nexgen-academy-development/htdocs/development.nexgen-academy.com
```

The deploy script is guarded to refuse any other path.

## How It Works

1. Run the local deploy script from your machine.
2. The script creates a source archive.
3. The archive is uploaded to the development server.
4. The server extracts it into a new release folder.
5. The server runs `npm ci --legacy-peer-deps` and `npm run build`.
6. If the build succeeds, `current` is switched to the new release.
7. PM2 starts or reloads `nexgen-development-website` on port `6060`.

If the build fails, `current` is not changed.

## Local Deploy

From this `Website` folder:

```bash
bash scripts/deploy-development-local.sh
```

Defaults:

```text
DEV_SERVER_HOST=85.31.237.111
DEV_SERVER_USER=root
DEV_SERVER_PORT=22
DEV_APP_ROOT=/home/nexgen-academy-development/htdocs/development.nexgen-academy.com
DEV_PM2_APP_NAME=nexgen-development-website
DEV_WEBSITE_PORT=6060
```

If you use an SSH key file locally:

```bash
DEV_SERVER_SSH_KEY_PATH=/path/to/key bash scripts/deploy-development-local.sh
```

If your terminal already has SSH access to the server, no extra variable is needed.

## One-Time Server Setup

Create the shared environment file:

```bash
mkdir -p /home/nexgen-academy-development/htdocs/development.nexgen-academy.com/shared
nano /home/nexgen-academy-development/htdocs/development.nexgen-academy.com/shared/.env.local
```

The deploy process copies that file into each release before building.
If no env file exists, the deploy script creates these public defaults:

```env
NEXT_PUBLIC_API_URL=https://api.nexgen-academy.com/api/v1
NEXT_PUBLIC_SOCKET_URL=https://api.nexgen-academy.com
```

After the first successful deploy, the app will run from:

```text
/home/nexgen-academy-development/htdocs/development.nexgen-academy.com/current
```

## Rollback

To roll back, point `current` to an older release and reload PM2:

```bash
ln -sfn /home/nexgen-academy-development/htdocs/development.nexgen-academy.com/releases/OLD_RELEASE /home/nexgen-academy-development/htdocs/development.nexgen-academy.com/current.new
mv -Tf /home/nexgen-academy-development/htdocs/development.nexgen-academy.com/current.new /home/nexgen-academy-development/htdocs/development.nexgen-academy.com/current
pm2 reload nexgen-development-website --update-env
```

## Cleanup

After a successful deploy, the script keeps the latest 3 releases and removes older ones.
It also removes uploaded archives older than 3 days.
