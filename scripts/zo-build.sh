#!/usr/bin/env bash
# Prepare a standalone AdonisJS build for a Zo Computer Service (no Docker).
set -euo pipefail

if ! command -v node >/dev/null || ! command -v npm >/dev/null; then
  echo "Node.js 24+ and npm are required." >&2
  exit 1
fi
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 24 ]; then
  echo "Node.js 24+ required; found $(node -v)." >&2
  exit 1
fi

npm ci
npm run typecheck
npm run build
(
  cd build
  npm ci --omit=dev
)
echo "Ready: compiled application in ./build"
echo "Configure environment variables and a writable persistent DB_FILE in Zo."
echo "Run migrations: cd build && NODE_ENV=production node ace migration:run --force"
echo "Register Zo Service: working directory <repo>/build, entrypoint node bin/server.js."
