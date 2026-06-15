#!/usr/bin/env bash
set -Eeuo pipefail

EXPECTED_APP_ROOT="/home/nexgen-academy-development/htdocs/development.nexgen-academy.com"

APP_ROOT="${1:?APP_ROOT is required}"
ARCHIVE_PATH="${2:?ARCHIVE_PATH is required}"
RELEASE_SHA="${3:?RELEASE_SHA is required}"
PM2_APP_NAME="${4:-nexgen-development-website}"
PORT="${5:-3333}"

load_node_runtime() {
  export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

  if [ -s "$HOME/.nvm/nvm.sh" ]; then
    # shellcheck disable=SC1091
    . "$HOME/.nvm/nvm.sh"
    nvm use --lts >/dev/null 2>&1 || nvm use default >/dev/null 2>&1 || true
  fi

  for node_bin in "$HOME"/.nvm/versions/node/*/bin /usr/local/node*/bin /opt/node*/bin; do
    if [ -d "$node_bin" ]; then
      export PATH="$node_bin:$PATH"
    fi
  done
}

if [ "$APP_ROOT" != "$EXPECTED_APP_ROOT" ]; then
  echo "Refusing to deploy outside the approved path: $EXPECTED_APP_ROOT"
  echo "Received: $APP_ROOT"
  exit 1
fi

case "$ARCHIVE_PATH" in
  "$APP_ROOT"/_deploy/incoming/*.tgz) ;;
  *)
    echo "Refusing archive outside approved incoming directory: $ARCHIVE_PATH"
    exit 1
    ;;
esac

if [ ! -f "$ARCHIVE_PATH" ]; then
  echo "Release archive does not exist: $ARCHIVE_PATH"
  exit 1
fi

RELEASE_NAME="$(date +%Y%m%d%H%M%S)-${RELEASE_SHA:0:7}"
RELEASES_DIR="$APP_ROOT/releases"
SHARED_DIR="$APP_ROOT/shared"
RELEASE_DIR="$RELEASES_DIR/$RELEASE_NAME"

load_node_runtime

if ! command -v npm >/dev/null 2>&1; then
  echo "npm was not found in this SSH deploy environment."
  echo "Install Node.js/npm for root, or install Node with nvm at /root/.nvm."
  echo "Current PATH: $PATH"
  exit 127
fi

echo "Node: $(node --version 2>/dev/null || echo unavailable)"
echo "npm: $(npm --version 2>/dev/null || echo unavailable)"

mkdir -p "$RELEASES_DIR" "$SHARED_DIR" "$APP_ROOT/_deploy/incoming"
mkdir -p "$RELEASE_DIR"

echo "Extracting release into $RELEASE_DIR"
tar -xzf "$ARCHIVE_PATH" -C "$RELEASE_DIR"

cd "$RELEASE_DIR"

if [ -f "$SHARED_DIR/.env.local" ]; then
  cp "$SHARED_DIR/.env.local" "$RELEASE_DIR/.env.local"
elif [ -f "$APP_ROOT/.env.local" ]; then
  cp "$APP_ROOT/.env.local" "$RELEASE_DIR/.env.local"
elif [ -f "$APP_ROOT/.env" ]; then
  cp "$APP_ROOT/.env" "$RELEASE_DIR/.env.local"
else
  echo "No environment file found. Creating default public development environment."
  cat > "$RELEASE_DIR/.env.local" <<'EOF'
NEXT_PUBLIC_API_URL=https://api.nexgen-academy.com/api/v1
NEXT_PUBLIC_SOCKET_URL=https://api.nexgen-academy.com
EOF
fi

echo "Installing dependencies"
npm ci

echo "Building Next.js app"
npm run build

if [ ! -f "$RELEASE_DIR/.next/BUILD_ID" ]; then
  echo "Build did not produce .next/BUILD_ID"
  exit 1
fi

echo "Switching current symlink"
ln -sfn "$RELEASE_DIR" "$APP_ROOT/current.new"
mv -Tf "$APP_ROOT/current.new" "$APP_ROOT/current"

echo "Starting or reloading PM2 app: $PM2_APP_NAME"
cd "$APP_ROOT/current"
if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
  PORT="$PORT" pm2 reload "$PM2_APP_NAME" --update-env
else
  PORT="$PORT" pm2 start node_modules/next/dist/bin/next --name "$PM2_APP_NAME" -- start -p "$PORT"
fi

pm2 save

echo "Deployment complete: $RELEASE_NAME"
