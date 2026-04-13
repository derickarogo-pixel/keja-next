# Build `keja-next` from this point to a complete rental listings app

This guide starts from your current state (Next.js app running, Prisma loaded, and `GET /api/houses` returning `405`) and takes you to a production-ready MVP.

---

## 0) Current issue first: fix `405 Method Not Allowed`

In `app/api/houses/route.ts`, you must export a `GET` function (and `POST` if creating records).

```ts
// app/api/houses/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const houses = await prisma.house.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(houses)
  } catch (error) {
    console.error('GET /api/houses failed:', error)
    return NextResponse.json({ error: 'Failed to fetch houses' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const house = await prisma.house.create({
      data: {
        title: body.title,
        price: Number(body.price),
        location: body.location,
        bedrooms: Number(body.bedrooms ?? 0),
        bathrooms: Number(body.bathrooms ?? 0),
        imageUrl: body.imageUrl ?? null,
        description: body.description ?? null,
      },
    })

    return NextResponse.json(house, { status: 201 })
  } catch (error) {
    console.error('POST /api/houses failed:', error)
    return NextResponse.json({ error: 'Failed to create house' }, { status: 500 })
  }
}
```

If it still seems stale, clear cache and restart:

```bash
rm -rf .next
npm run dev
```

---

## 1) Lock your Prisma model (MVP schema)

Use a practical model with timestamps and core listing fields:

```prisma
model House {
  id          String   @id @default(cuid())
  title       String
  description String?
  location    String
  price       Int
  bedrooms    Int      @default(0)
  bathrooms   Int      @default(0)
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Then run:

```bash
npx prisma migrate dev -n init_house_model
npx prisma generate
```

---

## 2) Add a safe Prisma singleton

Create `lib/prisma.ts`:

```ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## 3) Build API contract for listings

### `GET /api/houses`
- returns `House[]`
- supports optional filters later: `?minPrice=&maxPrice=&location=`

### `POST /api/houses`
- validates input
- returns created row with `201`

Recommended next improvement: add Zod validation before `prisma.house.create`.

---

## 4) Wire the Add House form page

On `/add-house`, submit JSON to `/api/houses`.

Pseudo-flow:
1. Prevent default submit.
2. Build payload.
3. `fetch('/api/houses', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) })`
4. Handle non-OK response and show toast/error message.
5. On success, redirect to listings page (`/houses`) or clear form.

---

## 5) Build houses listing page

Create `/houses` page that:
- calls `/api/houses` (server-side or client-side)
- renders cards with image, title, location, price, beds/baths
- handles empty state (`No listings yet`)
- links to details page `/houses/[id]`

---

## 6) Add details page

Create dynamic route `/houses/[id]`:
- query single house by id
- return 404 state if not found
- show full description + metadata

API option:
- add `app/api/houses/[id]/route.ts` with `GET`, `PATCH`, and `DELETE`.

---

## 7) Add validation + error UX

For both API and forms:
- required: `title`, `location`, `price`
- numeric guards: `price >= 0`, `bedrooms >= 0`, `bathrooms >= 0`
- show inline field errors
- show API failure alert and preserve user input

---

## 8) Add seed data for fast UI iteration

Create `prisma/seed.ts` with 8–12 listings and run:

```bash
npx prisma db seed
```

This helps you build cards/filters quickly without manual data entry.

---

## 9) Testing checklist before deployment

Run these every time before pushing:

```bash
npm run lint
npm run build
npm run test
```

And manual checks:
- `GET /api/houses` returns 200 + JSON array
- create listing from `/add-house` returns 201
- listing appears on `/houses`
- details page works
- invalid payload returns 400/422

---

## 10) Deploy-ready checklist

- Environment variables set in hosting (DB URL, etc.)
- Run Prisma migrations in production
- Basic logging enabled for API errors
- Add rate limiting + auth for create/update/delete endpoints
- Add image upload provider (Cloudinary/S3) rather than raw URL input

---

## Suggested build order (fastest path)

1. Fix `405` by exporting `GET` in `app/api/houses/route.ts`.
2. Confirm `GET /api/houses` works.
3. Implement `POST /api/houses`.
4. Wire `/add-house` form.
5. Build `/houses` list UI.
6. Add `/houses/[id]` detail view.
7. Add validation + better errors.
8. Seed data and polish styles.
9. Run lint/build/tests.
10. Deploy.

If you want, next I can generate exact code for each file in sequence (route handlers, form component, houses list page, and details page) so you can paste directly.
