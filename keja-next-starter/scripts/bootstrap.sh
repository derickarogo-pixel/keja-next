#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 /absolute/path/to/keja-next"
  exit 1
fi

TARGET="$1"

if [[ ! -d "$TARGET" ]]; then
  echo "Error: target directory not found: $TARGET"
  exit 1
fi

if [[ ! -f "$TARGET/package.json" ]]; then
  echo "Error: package.json not found in $TARGET"
  echo "Make sure this points to your Next.js project root."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "==> Copying starter files into $TARGET"
cp -r "$ROOT_DIR/app" "$TARGET/"
cp -r "$ROOT_DIR/lib" "$TARGET/"
cp -r "$ROOT_DIR/types" "$TARGET/"
mkdir -p "$TARGET/prisma"
cp "$ROOT_DIR/prisma/schema.prisma" "$TARGET/prisma/schema.prisma"

echo "==> Installing dependencies"
cd "$TARGET"
npm install @prisma/client
npm install -D prisma

echo "==> Running Prisma generate"
npx prisma generate

echo "==> Done"
echo
echo "Next steps:"
echo "1) Set DATABASE_URL in $TARGET/.env or .env.local"
echo "2) Run: npx prisma migrate dev -n init_house_model"
echo "3) Run: npm run dev"
echo "4) Visit: http://localhost:3000/api/houses"
