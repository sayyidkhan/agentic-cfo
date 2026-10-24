#!/usr/bin/env bash
# CI-only smoke test of the standalone production Node build. No Docker.
set -euo pipefail
test -f build/bin/server.js
test -f build/ace.js
test -f .env

cp .env build/.env
(
  cd build
  mkdir -p tmp
  export NODE_ENV=production
  export HOST=127.0.0.1
  export PORT=43371
  export APP_URL=http://127.0.0.1:43371
  export DB_FILE="$(pwd)/tmp/smoke.sqlite"
  node ace migration:run --force
  node bin/server.js >/tmp/agentic-cfo-node-smoke.log 2>&1 &
  pid=$!
  trap 'kill "$pid" 2>/dev/null || true' EXIT
  ok=0
  for i in $(seq 1 35); do
    if curl --silent --show-error --fail "http://127.0.0.1:43371/" >/dev/null 2>&1; then
      ok=1
      break
    fi
    if ! kill -0 "$pid" 2>/dev/null; then
      cat /tmp/agentic-cfo-node-smoke.log
      exit 1
    fi
    sleep 1
  done
  if [ "$ok" -ne 1 ]; then
    cat /tmp/agentic-cfo-node-smoke.log
    echo "Compiled AdonisJS server failed HTTP smoke test" >&2
    exit 1
  fi
  code="$(curl -s -o /dev/null -w '%{http_code}' 'http://127.0.0.1:43371/dashboard')"
  if [ "$code" != "302" ] && [ "$code" != "303" ]; then
    echo "Expected unauthenticated dashboard redirect, got HTTP $code" >&2
    exit 1
  fi
  echo "Standalone Node production app started; homepage and auth guard responded correctly."
)
