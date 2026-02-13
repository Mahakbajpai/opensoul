#!/usr/bin/env bash
set -euo pipefail

cd /repo

export OPENSOUL_STATE_DIR="/tmp/opensoul-test"
export OPENSOUL_CONFIG_PATH="${OPENSOUL_STATE_DIR}/opensoul.json"

echo "==> Build"
pnpm build

echo "==> Seed state"
mkdir -p "${OPENSOUL_STATE_DIR}/credentials"
mkdir -p "${OPENSOUL_STATE_DIR}/agents/main/sessions"
echo '{}' >"${OPENSOUL_CONFIG_PATH}"
echo 'creds' >"${OPENSOUL_STATE_DIR}/credentials/marker.txt"
echo 'session' >"${OPENSOUL_STATE_DIR}/agents/main/sessions/sessions.json"

echo "==> Reset (config+creds+sessions)"
pnpm opensoul reset --scope config+creds+sessions --yes --non-interactive

test ! -f "${OPENSOUL_CONFIG_PATH}"
test ! -d "${OPENSOUL_STATE_DIR}/credentials"
test ! -d "${OPENSOUL_STATE_DIR}/agents/main/sessions"

echo "==> Recreate minimal config"
mkdir -p "${OPENSOUL_STATE_DIR}/credentials"
echo '{}' >"${OPENSOUL_CONFIG_PATH}"

echo "==> Uninstall (state only)"
pnpm opensoul uninstall --state --yes --non-interactive

test ! -d "${OPENSOUL_STATE_DIR}"

echo "OK"
