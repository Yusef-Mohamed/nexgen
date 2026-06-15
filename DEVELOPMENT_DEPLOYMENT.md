# Development Website Deployment

This repo deploys the `development` branch to:

```text
/home/nexgen-academy-development/htdocs/development.nexgen-academy.com
```

The deploy script is guarded to refuse any other path.

## How It Works

1. GitHub Actions runs on every push to `development`.
2. The workflow creates a source archive from the checked-out branch.
3. The archive is uploaded to the development server.
4. The server extracts it into a new release folder.
5. The server runs `npm ci` and `npm run build`.
6. If the build succeeds, `current` is switched to the new release.
7. PM2 starts or reloads `nexgen-development-website`.

If the build fails, `current` is not changed.

## Required GitHub Secrets

Add these secrets in GitHub:

```text
DEV_SERVER_HOST
DEV_SERVER_USER
DEV_SERVER_PORT
DEV_SERVER_SSH_KEY
```

Use an SSH private key created only for deployment. Do not use a personal SSH key.

## One-Time Server Setup

Create the shared environment file:

```bash
mkdir -p /home/nexgen-academy-development/htdocs/development.nexgen-academy.com/shared
nano /home/nexgen-academy-development/htdocs/development.nexgen-academy.com/shared/.env.local
```

The deploy process copies that file into each release before building.

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
