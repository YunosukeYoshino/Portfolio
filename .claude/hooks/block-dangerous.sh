#!/bin/bash
# PreToolUse: Block dangerous bash commands (force push, rm -rf, reset --hard)
set -euo pipefail

INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if echo "$CMD" | grep -qE 'git\s+push\s+.*--force|git\s+reset\s+--hard|rm\s+-rf|rm\s+-r\s'; then
  echo "Blocked: dangerous command detected" >&2
  exit 2
fi
