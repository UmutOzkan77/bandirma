#!/usr/bin/env bash
set -euo pipefail

if [[ $# -eq 0 ]]; then
  echo "Usage: $0 <script> [args...]" >&2
  exit 1
fi

candidates=(
  "${NODE20_BIN:-}"
  "/opt/homebrew/opt/node@20/bin/node"
  "/opt/homebrew/Cellar/node@20/20.20.1/bin/node"
)

node_bin=""
for candidate in "${candidates[@]}"; do
  if [[ -n "$candidate" && -x "$candidate" ]]; then
    node_bin="$candidate"
    break
  fi
done

if [[ -z "$node_bin" ]]; then
  node_bin="$(command -v node)"
fi

exec "$node_bin" "$@"
