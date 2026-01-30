#!/usr/bin/env bash
set -euo pipefail

#############################################
# CONFIG (override via env)
#############################################
APP_DIR="${APP_DIR:-/var/www/debarras-server}"
BRANCH="${BRANCH:-production}"
REPO_URL="${REPO_URL:-}"

ENV_FILE="$APP_DIR/.env"
ENV_PAYLOAD_PATH="${ENV_PAYLOAD_PATH:-/tmp/express-api.env}"

PM2_APP="${PM2_APP:-debarras-server}"

# If you use NVM on the server:
NODE_VERSION="${NODE_VERSION:-}"
NVM_DIR="${NVM_DIR:-$HOME/.nvm}"

# GitHub deploy key path ON SERVER (private key file).
# This is used ONLY for "git clone/pull" from GitHub.
GITHUB_DEPLOY_KEY_PATH="${GITHUB_DEPLOY_KEY_PATH:-$HOME/.ssh/debarras_server_github_deploy}"
GITHUB_KNOWN_HOSTS="${GITHUB_KNOWN_HOSTS:-$HOME/.ssh/known_hosts}"

LOCK_FILE="/tmp/deploy_debarras_server.lock"

log() { printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"; }

require() {
  command -v "$1" >/dev/null 2>&1 || { log "ERROR: missing dependency: $1"; exit 1; }
}

has_npm_script() {
  node -e "const p=require('./package.json');process.exit(p.scripts&&p.scripts['$1']?0:1)" >/dev/null 2>&1
}

#############################################
# LOCK (avoid concurrent deploys)
#############################################
if command -v flock >/dev/null 2>&1; then
  exec 9>"$LOCK_FILE"
  if ! flock -n 9; then
    log "Another deployment is running. Exiting."
    exit 0
  fi
else
  log "flock not available; continuing without a deploy lock."
fi

#############################################
# PRE-FLIGHT
#############################################
require git
require rsync

if [[ -z "$REPO_URL" ]]; then
  log "ERROR: REPO_URL is empty. Provide REPO_URL (SSH URL) from workflow."
  exit 1
fi

if [[ -d "$APP_DIR" ]]; then
  if [[ ! -w "$APP_DIR" ]]; then
    if command -v sudo >/dev/null 2>&1; then
      log "Fixing permissions for $APP_DIR"
      sudo chown -R "$USER":"$USER" "$APP_DIR"
    else
      log "ERROR: No write permission for $APP_DIR and sudo is not available."
      exit 1
    fi
  fi
else
  if mkdir -p "$APP_DIR" 2>/dev/null; then
    :
  else
    if command -v sudo >/dev/null 2>&1; then
      log "Creating deploy directory with sudo: $APP_DIR"
      sudo mkdir -p "$APP_DIR"
      sudo chown -R "$USER":"$USER" "$APP_DIR"
    else
      log "ERROR: Cannot create $APP_DIR and sudo is not available."
      exit 1
    fi
  fi
fi
log "Deploy dir: $APP_DIR"
log "Repo: $REPO_URL (branch: $BRANCH)"

#############################################
# NVM / NODE
#############################################
if [[ -f "$NVM_DIR/nvm.sh" ]]; then
  # shellcheck disable=SC1091
  source "$NVM_DIR/nvm.sh"
  if [[ -n "$NODE_VERSION" ]]; then
    log "Using Node via NVM: $NODE_VERSION"
    nvm install "$NODE_VERSION" >/dev/null
    nvm use "$NODE_VERSION" >/dev/null
  fi
else
  log "NVM not found at $NVM_DIR (using system node)"
fi

log "Node: $(node -v 2>/dev/null || echo 'not found')"
log "NPM:  $(npm -v 2>/dev/null || echo 'not found')"

#############################################
# GIT AUTH (VPS -> GitHub) via deploy key
#############################################
if [[ -f "$GITHUB_DEPLOY_KEY_PATH" ]]; then
  mkdir -p "$(dirname "$GITHUB_KNOWN_HOSTS")"
  touch "$GITHUB_KNOWN_HOSTS"
  chmod 600 "$GITHUB_KNOWN_HOSTS" || true

  # Ensure github.com is in known_hosts (prefer pinning, but this is safer than disabling checks)
  if ! ssh-keygen -F github.com -f "$GITHUB_KNOWN_HOSTS" >/dev/null 2>&1; then
    log "Adding github.com to known_hosts (consider pinning GitHub fingerprints)."
    ssh-keyscan -H github.com >> "$GITHUB_KNOWN_HOSTS" 2>/dev/null || true
  fi

  export GIT_SSH_COMMAND="ssh -i '$GITHUB_DEPLOY_KEY_PATH' -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o UserKnownHostsFile='$GITHUB_KNOWN_HOSTS'"
else
  log "WARNING: GitHub deploy key not found at $GITHUB_DEPLOY_KEY_PATH"
  log "         Git operations may fail unless another SSH key is configured."
fi

#############################################
# CLONE / UPDATE
#############################################
cd "$APP_DIR"

#############################################
# ENV (optional payload + load)
#############################################
if [[ -f "$ENV_PAYLOAD_PATH" ]]; then
  log "Applying .env payload"
  mv "$ENV_PAYLOAD_PATH" "$ENV_FILE"
fi

touch "$ENV_FILE"

set -a
# shellcheck disable=SC1090
source "$ENV_FILE" || true
set +a

if [[ ! -d ".git" ]]; then
  TMP_CLONE="/tmp/debarras_server_clone_$$"
  log "First deploy → cloning into: $TMP_CLONE"
  git clone --branch "$BRANCH" "$REPO_URL" "$TMP_CLONE"
  log "Syncing to $APP_DIR"
  rsync -a --delete "$TMP_CLONE/" "$APP_DIR/"
  rm -rf "$TMP_CLONE"
else
  log "Updating existing repo"
  git fetch --prune origin
  git checkout "$BRANCH" || true
  git reset --hard "origin/$BRANCH"
  git clean -fd
fi

cd "$APP_DIR"

#############################################
# INSTALL
#############################################
require npm

if [[ -f package-lock.json ]]; then
  log "Installing dependencies (npm install)"
  npm install --no-audit --no-fund
else
  log "Installing dependencies (npm install)"
  npm install --no-audit --no-fund
fi

#############################################
# PRISMA (optional)
#############################################
if [[ -f "prisma/schema.prisma" ]]; then
  log "Prisma detected"

  if [[ -z "${DATABASE_URL:-}" ]]; then
    log "ERROR: DATABASE_URL is not set. Check $ENV_FILE"
    exit 1
  fi

  if has_npm_script "prisma:generate"; then
    npm run prisma:generate
  else
    npx prisma generate
  fi

  # Safe default for production DB
  npx prisma migrate deploy || log "WARN: prisma migrate deploy failed (check DB / migrations)"

  if has_npm_script "prisma:seed"; then
    npx prisma db seed
  fi
fi

#############################################
# BUILD (optional)
#############################################
if has_npm_script "build"; then
  log "Building (npm run build)"
  npm run build
else
  log "No build script found (skipped)"
fi

#############################################
# RESTART (PM2)
#############################################
if command -v pm2 >/dev/null 2>&1; then
  log "PM2 found"

  # Prefer ecosystem file if exists
  if [[ -f "ecosystem.config.cjs" || -f "ecosystem.config.js" ]]; then
    ECOSYSTEM="ecosystem.config.cjs"
    [[ -f "ecosystem.config.js" ]] && ECOSYSTEM="ecosystem.config.js"

    log "Using $ECOSYSTEM"
    if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
      pm2 restart "$ECOSYSTEM" --env production
    else
      pm2 start "$ECOSYSTEM" --env production
    fi
  else
    # Fallback: run npm start under PM2
    if has_npm_script "start"; then
      if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
        pm2 restart "$PM2_APP"
      else
        pm2 start npm --name "$PM2_APP" -- start
      fi
    else
      log "ERROR: No ecosystem config and no npm start script."
      exit 1
    fi
  fi

  pm2 save
  log "Deployment done ✅ (PM2 app: $PM2_APP)"
else
  log "ERROR: PM2 is not installed on the server."
  exit 1
fi
