# keja-next starter

Yes — you can build the app from here.

## Fastest way (Linux)

```bash
# From this repo root
bash keja-next-starter/scripts/bootstrap.sh ~/keja-next
```

Then in `~/keja-next`:

```bash
# Add your DB URL first in .env or .env.local
npx prisma migrate dev -n init_house_model
npm run dev
```

Open:
- `http://localhost:3000/api/houses`
- `http://localhost:3000/add-house`
- `http://localhost:3000/houses`

## If your project uses different paths
Use `keja-next-starter/APPLY_IN_LINUX.md` for manual copy steps.
