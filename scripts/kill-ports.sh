#!/usr/bin/env bash
set -euo pipefail

# Local ports used by this monorepo (Next, SST, Mastra/API).
# Extra ports can be passed as args: bun run kill:ports -- 5173 8080
DEFAULT_PORTS=(3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010 4111)

if [ "$#" -gt 0 ]; then
  PORTS=("$@")
else
  PORTS=("${DEFAULT_PORTS[@]}")
fi

killed_any=0

for port in "${PORTS[@]}"; do
  if ! [[ "$port" =~ ^[0-9]+$ ]]; then
    echo "skip invalid port: $port" >&2
    continue
  fi

  pids=$(lsof -ti tcp:"$port" -sTCP:LISTEN 2>/dev/null || true)
  if [ -z "$pids" ]; then
    continue
  fi

  echo "port $port: killing $pids"
  # shellcheck disable=SC2086
  kill $pids 2>/dev/null || true
  killed_any=1

  sleep 0.3
  still=$(lsof -ti tcp:"$port" -sTCP:LISTEN 2>/dev/null || true)
  if [ -n "$still" ]; then
    echo "port $port: force killing $still"
    # shellcheck disable=SC2086
    kill -9 $still 2>/dev/null || true
  fi
done

if [ "$killed_any" -eq 0 ]; then
  echo "no listeners on: ${PORTS[*]}"
else
  echo "done"
fi
