#!/bin/bash
# Stop: Warn about uncommitted changes and leftover console.log
set -euo pipefail

INPUT=$(cat)

# Prevent infinite loop
if [ "$(echo "$INPUT" | jq -r '.stop_hook_active')" = "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"
WARNINGS=""

# Check uncommitted changes
if git diff --name-only 2>/dev/null | grep -q '.'; then
  WARNINGS="Uncommitted changes detected."
fi

# Check for console.log in staged/modified ts/tsx files
DIRTY_FILES=$(git diff --name-only --diff-filter=AM 2>/dev/null | grep -E '\.(ts|tsx)$' || true)
if [ -n "$DIRTY_FILES" ]; then
  LOG_HITS=$(echo "$DIRTY_FILES" | xargs grep -l 'console\.log' 2>/dev/null || true)
  if [ -n "$LOG_HITS" ]; then
    WARNINGS="${WARNINGS:+$WARNINGS }console.log found in: $LOG_HITS"
  fi
fi

if [ -n "$WARNINGS" ]; then
  echo "$WARNINGS" >&2
  exit 2
fi
