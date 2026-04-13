#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${1:-$PWD}"
ROUTE_FILE="$APP_DIR/app/api/houses/route.ts"

echo "Checking project: $APP_DIR"

if [[ ! -f "$ROUTE_FILE" ]]; then
  echo "❌ Missing file: $ROUTE_FILE"
  exit 1
fi

echo "✅ Found: $ROUTE_FILE"

if rg -n "export\s+async\s+function\s+GET\s*\(" "$ROUTE_FILE" >/dev/null; then
  echo "✅ GET handler exported"
else
  echo "❌ GET handler NOT exported (this causes 405 for GET /api/houses)"
fi

if rg -n "export\s+default" "$ROUTE_FILE" >/dev/null; then
  echo "⚠️  Found default export in route.ts (App Router route handlers should use named exports)"
else
  echo "✅ No default export detected"
fi

if [[ -f "$APP_DIR/pages/api/houses.ts" || -f "$APP_DIR/pages/api/houses.js" ]]; then
  echo "⚠️  Found pages/api/houses.* which may conflict with app router expectations"
else
  echo "✅ No pages/api/houses.* conflict found"
fi

if [[ -d "$APP_DIR/.next" ]]; then
  echo "ℹ️  .next exists. If you've changed routes, run: rm -rf .next && npm run dev"
fi

echo "Done."
