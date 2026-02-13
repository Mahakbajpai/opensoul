#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_NAME="${OPENSOUL_IMAGE:-${OPENSOUL_IMAGE:-opensoul:local}}"
CONFIG_DIR="${OPENSOUL_CONFIG_DIR:-${OPENSOUL_CONFIG_DIR:-$HOME/.opensoul}}"
WORKSPACE_DIR="${OPENSOUL_WORKSPACE_DIR:-${OPENSOUL_WORKSPACE_DIR:-$HOME/.opensoul/workspace}}"
PROFILE_FILE="${OPENSOUL_PROFILE_FILE:-${OPENSOUL_PROFILE_FILE:-$HOME/.profile}}"

PROFILE_MOUNT=()
if [[ -f "$PROFILE_FILE" ]]; then
  PROFILE_MOUNT=(-v "$PROFILE_FILE":/home/node/.profile:ro)
fi

echo "==> Build image: $IMAGE_NAME"
docker build -t "$IMAGE_NAME" -f "$ROOT_DIR/Dockerfile" "$ROOT_DIR"

echo "==> Run live model tests (profile keys)"
docker run --rm -t \
  --entrypoint bash \
  -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
  -e HOME=/home/node \
  -e NODE_OPTIONS=--disable-warning=ExperimentalWarning \
  -e OPENSOUL_LIVE_TEST=1 \
  -e OPENSOUL_LIVE_MODELS="${OPENSOUL_LIVE_MODELS:-${OPENSOUL_LIVE_MODELS:-all}}" \
  -e OPENSOUL_LIVE_PROVIDERS="${OPENSOUL_LIVE_PROVIDERS:-${OPENSOUL_LIVE_PROVIDERS:-}}" \
  -e OPENSOUL_LIVE_MODEL_TIMEOUT_MS="${OPENSOUL_LIVE_MODEL_TIMEOUT_MS:-${OPENSOUL_LIVE_MODEL_TIMEOUT_MS:-}}" \
  -e OPENSOUL_LIVE_REQUIRE_PROFILE_KEYS="${OPENSOUL_LIVE_REQUIRE_PROFILE_KEYS:-${OPENSOUL_LIVE_REQUIRE_PROFILE_KEYS:-}}" \
  -v "$CONFIG_DIR":/home/node/.opensoul \
  -v "$WORKSPACE_DIR":/home/node/.opensoul/workspace \
  "${PROFILE_MOUNT[@]}" \
  "$IMAGE_NAME" \
  -lc "set -euo pipefail; [ -f \"$HOME/.profile\" ] && source \"$HOME/.profile\" || true; cd /app && pnpm test:live"
