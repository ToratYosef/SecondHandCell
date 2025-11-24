#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_NAME="${1:-backend-only.zip}"

cd "$ROOT_DIR"

INCLUDE_ITEMS=(
  "server"
  "shared"
  "drizzle.config.ts"
  "tsconfig.json"
  "server-api-only.js"
  "package.json"
  "package-lock.json"
  "server/package.json"
)

EXCLUDE_PATTERNS=(
  "*/node_modules/*"
  "*/dist/*"
  "client/*"
  "app/*"
  "public/*"
  "attached_assets/*"
  "backend-only.zip"
  "dev.db"
  "*.log"
  ".git/*"
)

zip -r "$OUTPUT_NAME" "${INCLUDE_ITEMS[@]}" -x "${EXCLUDE_PATTERNS[@]}"

echo "Created $OUTPUT_NAME with backend-only resources."
