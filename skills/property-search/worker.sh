#!/bin/sh
set -eu

PROJECT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)"
WORKSPACE="$HOME/.openclaw-idx-internship/sandboxes/workspace-18a1dc58f08c28157fa44e9a89e4b866"

REQUEST="$WORKSPACE/idx-search-request.json"
RESPONSE="$WORKSPACE/idx-search-response.json"

cd "$PROJECT_DIR"

echo "IDX property-search worker started."
echo "Press Control+C to stop."

while true; do
  if [ -f "$REQUEST" ] && [ ! -L "$REQUEST" ]; then
    rm -f "$RESPONSE"

    if node --env-file=.env --experimental-strip-types \
      skills/property-search/bridge.ts; then
      echo "Request processed successfully."
    else
      echo "Request failed validation or processing." >&2
    fi

    rm -f "$REQUEST"
  fi

  sleep 1
done
