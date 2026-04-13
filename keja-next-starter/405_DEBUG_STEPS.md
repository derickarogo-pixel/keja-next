# 405 debug steps for `GET /api/houses` (Linux)

From your log, two important points:

1. `1s` is a typo. Use `ls` (lowercase L + s).
2. `route.js` does not exist, so deleting it changes nothing.

---

## 1) Put this exact code in `app/api/houses/route.ts`

```ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ ok: true, message: 'GET works' })
}
```

No default export. It must be named `GET`.

---

## 2) Restart clean

```bash
rm -rf .next
npm run dev
```

Then open `http://localhost:3000/api/houses`.

If this still returns 405, continue below.

---

## 3) Run automatic checker

If you have this starter repo cloned:

```bash
bash keja-next-starter/scripts/check-405.sh ~/keja-next
```

This checks:
- `route.ts` exists
- `export async function GET()` exists
- no `export default`
- no `pages/api/houses.ts` conflict

---

## 4) Common causes of persistent 405

- `GET` not exported (most common)
- exporting `default` instead of named method
- wrong file location (must be `app/api/houses/route.ts`)
- editing another folder while running dev in different folder
- stale server process in another terminal/session

---

## 5) Final isolation test

Create a brand-new route to prove App Router methods work:

`app/api/ping/route.ts`

```ts
import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({ pong: true })
}
```

If `/api/ping` works but `/api/houses` is 405, the issue is inside `app/api/houses/route.ts` content.
