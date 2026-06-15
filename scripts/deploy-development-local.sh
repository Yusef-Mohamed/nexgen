#!/usr/bin/env bash
set -Eeuo pipefail

SERVER_HOST="${DEV_SERVER_HOST:-85.31.237.111}"
SERVER_USER="${DEV_SERVER_USER:-root}"
SERVER_PORT="${DEV_SERVER_PORT:-22}"
APP_ROOT="${DEV_APP_ROOT:-/home/nexgen-academy-development/htdocs/development.nexgen-academy.com}"
PM2_APP_NAME="${DEV_PM2_APP_NAME:-nexgen-development-website}"
PORT="${DEV_WEBSITE_PORT:-6060}"
SSH_KEY="${DEV_SERVER_SSH_KEY_PATH:-}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
RELEASE_SHA="$(git -C "$REPO_ROOT" rev-parse --short=12 HEAD 2>/dev/null || date +%Y%m%d%H%M)"
ARCHIVE_NAME="website-release-${RELEASE_SHA}.tgz"
LOCAL_ARCHIVE="${TMPDIR:-/tmp}/$ARCHIVE_NAME"
REMOTE_ARCHIVE="$APP_ROOT/_deploy/incoming/$ARCHIVE_NAME"
REMOTE_SCRIPT="$APP_ROOT/_deploy/deploy-development-website.sh"

SSH_OPTS=(
  -p "$SERVER_PORT"
  -o StrictHostKeyChecking=accept-new
  -o ConnectTimeout=20
  -o ServerAliveInterval=15
  -o ServerAliveCountMax=2
)

SCP_OPTS=(
  -P "$SERVER_PORT"
  -o StrictHostKeyChecking=accept-new
  -o ConnectTimeout=20
  -o ServerAliveInterval=15
  -o ServerAliveCountMax=2
)

if [ -n "$SSH_KEY" ]; then
  SSH_OPTS+=(-i "$SSH_KEY")
  SCP_OPTS+=(-i "$SSH_KEY")
fi

remote="$SERVER_USER@$SERVER_HOST"

cleanup() {
  rm -f "$LOCAL_ARCHIVE"
}
trap cleanup EXIT

echo "Creating release archive: $LOCAL_ARCHIVE"
tar \
  -C "$REPO_ROOT" \
  --exclude='.git' \
  --exclude='.github' \
  --exclude='.next' \
  --exclude='node_modules' \
  --exclude='Website.rar' \
  --exclude='*.log' \
  -czf "$LOCAL_ARCHIVE" .

echo "Preparing remote deploy directory"
ssh "${SSH_OPTS[@]}" "$remote" "mkdir -p '$APP_ROOT/_deploy/incoming'"

echo "Uploading deploy script"
scp "${SCP_OPTS[@]}" "$REPO_ROOT/scripts/deploy-development-website.sh" "$remote:$REMOTE_SCRIPT"

echo "Uploading release archive"
scp "${SCP_OPTS[@]}" "$LOCAL_ARCHIVE" "$remote:$REMOTE_ARCHIVE"

echo "Running remote deploy"
ssh "${SSH_OPTS[@]}" "$remote" \
  "bash '$REMOTE_SCRIPT' '$APP_ROOT' '$REMOTE_ARCHIVE' '$RELEASE_SHA' '$PM2_APP_NAME' '$PORT'"

echo "Done. Development website deployed to $APP_ROOT on port $PORT."
