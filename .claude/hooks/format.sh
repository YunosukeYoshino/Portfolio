#!/bin/bash
# PostToolUse: Auto-format edited files with Biome
set -euo pipefail

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"
bunx biome check --write "$FILE" 2>/dev/null || true
