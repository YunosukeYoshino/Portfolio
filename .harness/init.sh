#!/bin/bash
# TanStack Start Migration - Environment Setup

echo "=== Harness: TanStack Start Migration ==="
echo ""

# Check bun is available
if ! command -v bun &> /dev/null; then
    echo "Error: bun is not installed"
    exit 1
fi

echo "✓ bun available"

# Install dependencies
echo "Installing dependencies..."
bun install

echo ""
echo "Harness initialized successfully!"
echo "Run '/harness:resume' at the start of each session."
