# Linux quickstart (how to use this now)

This is the shortest path if you are on Linux.

## 1) Open terminal

```bash
cd /path/to/this/repo
```

## 2) Apply starter code into your existing app

```bash
bash keja-next-starter/scripts/bootstrap.sh ~/keja-next
```

## 3) Go to your app and configure env

```bash
cd ~/keja-next
nano .env.local
```

Add:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Save nano with `Ctrl+O`, Enter, then exit `Ctrl+X`.

## 4) Run migration and start app

```bash
npx prisma migrate dev -n init_house_model
npm run dev
```

## 5) Verify in browser

- `http://localhost:3000/api/houses`
- `http://localhost:3000/add-house`
- `http://localhost:3000/houses`

If you get 405:

```bash
rm -rf .next
npm run dev
```
