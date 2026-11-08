#!/usr/bin/env python3
import json
import os
import sys
import time
from pathlib import Path

WORKSPACE = Path("/workspace")
REQUEST = WORKSPACE / "idx-search-request.json"
RESPONSE = WORKSPACE / "idx-search-response.json"

def main():
    args = sys.argv[1:]
    include_comps = "--comps" in args
    query = " ".join(a for a in args if a != "--comps").strip()

    if not 3 <= len(query) <= 500:
        raise ValueError("Search query must be 3 to 500 characters.")

    if REQUEST.exists() or REQUEST.is_symlink():
        raise RuntimeError("Another search request is already pending.")

    if RESPONSE.is_symlink():
        raise RuntimeError("Unexpected response file.")

    RESPONSE.unlink(missing_ok=True)

    payload = {"query": query, "includeComps": include_comps}
    temporary = WORKSPACE / "idx-search-request.tmp"

    if temporary.exists() or temporary.is_symlink():
        raise RuntimeError("Temporary request file already exists.")

    try:
        with temporary.open("x", encoding="utf-8") as f:
            json.dump(payload, f)
        os.replace(temporary, REQUEST)

        deadline = time.monotonic() + 30
        while time.monotonic() < deadline:
            if RESPONSE.exists():
                data = json.loads(RESPONSE.read_text(encoding="utf-8"))
                print(json.dumps(data, indent=2))
                return
            time.sleep(0.5)

        raise TimeoutError("No response. Check that the Mac worker is running.")
    finally:
        temporary.unlink(missing_ok=True)

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"Property search failed: {exc}", file=sys.stderr)
        sys.exit(1)
