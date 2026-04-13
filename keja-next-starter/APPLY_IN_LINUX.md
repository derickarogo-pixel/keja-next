# Apply these files to your existing `~/keja-next` project (Linux)

Use this when you already have a Next.js app and just want to drop in the generated code.

## Option A (Recommended): copy files by path

From the repository that contains `keja-next-starter/` run:

```bash
# 1) Set target app path
TARGET=~/keja-next

# 2) Copy starter files into your app
cp -r keja-next-starter/app "$TARGET/"
cp -r keja-next-starter/lib "$TARGET/"
cp -r keja-next-starter/types "$TARGET/"
mkdir -p "$TARGET/prisma"
cp keja-next-starter/prisma/schema.prisma "$TARGET/prisma/schema.prisma"

# 3) Go to your app
cd "$TARGET"
```

## Option B: paste manually with nano

For each file below, open in nano and paste contents from the generated file:

- `app/api/houses/route.ts`
- `app/api/houses/[id]/route.ts`
- `app/add-house/page.tsx`
- `app/houses/page.tsx`
- `app/houses/[id]/page.tsx`
- `lib/prisma.ts`
- `types/house.ts`
- `prisma/schema.prisma`

Nano shortcuts:
- Save: `Ctrl+O`, then `Enter`
- Exit: `Ctrl+X`

---

## Required project checks after copying

### 1) Install dependencies

```bash
npm install @prisma/client
npm install -D prisma
```

### 2) Ensure path alias exists

In `tsconfig.json`, confirm:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

If you do not want aliases, replace imports like `@/lib/prisma` with relative imports.

### 3) Set environment variable

In `.env` (or `.env.local`):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4) Run Prisma

```bash
npx prisma generate
npx prisma migrate dev -n init_house_model
```

### 5) Run the app

```bash
npm run dev
```

---

## Quick verification

1. Open `http://localhost:3000/api/houses` → should return `[]` or JSON data (not 405).
2. Open `http://localhost:3000/add-house` and submit one listing.
3. Open `http://localhost:3000/houses` and confirm card appears.
4. Click details link and verify `/houses/[id]` loads.

---

## If you still get `405` on `/api/houses`

1. Confirm file path is exactly `app/api/houses/route.ts`.
2. Confirm it exports `GET` (and `POST`).
3. Remove cache and restart:

```bash
rm -rf .next
npm run dev
```

4. Ensure there is not another conflicting route in `pages/api/houses.ts`.
