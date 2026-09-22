#!/usr/bin/env bash
#
# CenterPort deploy script -> builds Docker images ON the server and runs them.
#
# Why build on the server: the local Docker engine is unavailable, and the
# target host (192.168.100.50) already has Docker. We ship the source, then
# `docker compose build` + `up` remotely.
#
# Auth: password-based SSH. Each ssh/scp call below will prompt for the
# password interactively at runtime. Nothing is stored or logged.
#
# Usage:
#   ./deploy.sh                # full deploy: sync + build + up
#   ./deploy.sh logs           # tail remote container logs
#   ./deploy.sh down           # stop the remote stack
#
set -euo pipefail

# ---- Config -----------------------------------------------------------------
SSH_USER="koi"
SSH_HOST="192.168.100.50"
SSH_PORT="22"
REMOTE_DIR="/home/${SSH_USER}/centerport"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SSH="ssh -p ${SSH_PORT} ${SSH_USER}@${SSH_HOST}"

# Files/dirs to exclude from the upload (heavy or environment-specific).
EXCLUDES=(
  --exclude ".git"
  --exclude "node_modules"
  --exclude ".next"
  --exclude "target"
  --exclude "backend/logs"
  --exclude "backend/uploads"
  --exclude "reference"
  --exclude "reports"
  --exclude "semantic-review"
)

log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }

# ---- Subcommands ------------------------------------------------------------
case "${1:-deploy}" in
  logs)
    log "Tailing remote logs (Ctrl+C to stop)"
    exec ${SSH} "cd ${REMOTE_DIR} && docker compose logs -f --tail=100"
    ;;
  down)
    log "Stopping remote stack"
    exec ${SSH} "cd ${REMOTE_DIR} && docker compose down"
    ;;
  deploy) ;;  # fall through
  *)
    echo "Unknown command: $1" >&2
    echo "Usage: ./deploy.sh [deploy|logs|down]" >&2
    exit 1
    ;;
esac

# ---- 1. Preflight: verify Docker exists on the server -----------------------
log "Checking Docker on ${SSH_HOST} (you'll be prompted for the SSH password)"
${SSH} 'docker --version && docker compose version'

# ---- 2. Sync source to the server -------------------------------------------
# Prefer rsync (incremental); fall back to a tar-over-ssh copy if rsync is absent.
${SSH} "mkdir -p ${REMOTE_DIR}"

if command -v rsync >/dev/null 2>&1; then
  log "Syncing source with rsync"
  rsync -az --delete "${EXCLUDES[@]}" \
    -e "ssh -p ${SSH_PORT}" \
    "${SCRIPT_DIR}/" "${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/"
else
  log "rsync not found locally; copying with tar over ssh"
  tar_excludes=()
  for e in "${EXCLUDES[@]}"; do
    [ "$e" = "--exclude" ] && continue
    tar_excludes+=(--exclude="$e")
  done
  tar czf - -C "${SCRIPT_DIR}" "${tar_excludes[@]}" . \
    | ${SSH} "tar xzf - -C ${REMOTE_DIR}"
fi

# ---- 3. Build images on the server ------------------------------------------
log "Building images on the server (first build downloads base images; be patient)"
${SSH} "cd ${REMOTE_DIR} && docker compose build"

# ---- 4. Start the stack -----------------------------------------------------
log "Starting containers"
${SSH} "cd ${REMOTE_DIR} && docker compose up -d"

# ---- 5. Status --------------------------------------------------------------
log "Container status"
${SSH} "cd ${REMOTE_DIR} && docker compose ps"

cat <<EOF

Done. Services should be reachable at:
  Frontend : http://${SSH_HOST}:3000
  Backend  : http://${SSH_HOST}:8081   (Swagger: http://${SSH_HOST}:8081/swagger-ui.html)

Follow logs:  ./deploy.sh logs
Stop stack:   ./deploy.sh down

Reminder: register this Keycloak Valid Redirect URI on centerport-client:
  http://${SSH_HOST}:3000/api/backend/login/oauth2/code/keycloak
EOF
