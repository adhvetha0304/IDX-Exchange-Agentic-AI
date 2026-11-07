#!/bin/sh
set -eu

PROJECT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)"
PARSER="$PROJECT_DIR/skills/property-search/parser.py"

CONTAINER="${1:-}"

if [ -z "$CONTAINER" ]; then
  echo "Usage: sh skills/property-search/deploy.sh CONTAINER_NAME" >&2
  exit 1
fi

case "$CONTAINER" in
  openclaw-sbx-workspace-*) ;;
  *)
    echo "Error: Expected an OpenClaw workspace sandbox." >&2
    exit 1
    ;;
esac

docker cp "$PARSER" "$CONTAINER:/workspace/property-search-parser.py"

echo "Parser deployed to the selected OpenClaw sandbox."
