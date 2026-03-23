# Deploying `apps/api` to Render (Docker)

Steps to deploy the backend to Render using the provided Dockerfile and run the Prisma seed automatically.

1. Update `render.yaml` with your repository details

- Open `render.yaml` and set `repo: https://github.com/YOUR_ORG/YOUR_REPO` and `branch` to the branch you will deploy from.

2. Ensure `render.yaml` points to the Dockerfile

- The template already uses `dockerfilePath: apps/api/Dockerfile`.

3. Environment variables required on Render

- `DATABASE_URL` — Render Postgres provides this automatically if you create the database via Render or you can paste the connection string from your managed Postgres.
- `REDIS_URL` or `UPSTASH_REDIS_REST_URL` — set to your Upstash Redis connection string (e.g. `rediss://...` or `redis://...`).
- Any other runtime secrets (JWT keys, STRIPE keys, etc.) used by `apps/api`.

Note: you provided the external Postgres URL for seeding:

`postgresql://my_db_l5px_user:suXEZ3YLX3Tl21vzeK18iTryiKNRFZ0s@dpg-d70i5iqa214c73eaj640-a.oregon-postgres.render.com/my_db_l5px`

If you want this embedded in `render.yaml`, it's already added under the `parkhub-api` service as `DATABASE_URL`.

4. Seed and migrations

- The container entrypoint (`apps/api/entrypoint.sh`) runs:
  - `npx prisma migrate deploy --schema=prisma/schema.prisma`
  - `npx prisma db seed --schema=prisma/schema.prisma`

  This will run migrations and then execute the seed script located at `apps/api/prisma/seed/index.ts`.

5. Deploy

- Commit and push your changes (Dockerfile, entrypoint, render.yaml updates).
- Deploy using Render dashboard or by pushing to the configured branch if you use `render.yaml` automations.

6. Local testing (optional)

- Run the local stack:

```bash
docker compose up --build
```

- This brings up Postgres, Redis, and the API. The API will run migrations and seed on first start.

Notes

- The Dockerfile builds the entire monorepo to ensure workspace dependencies are available; image size may be larger than single-package images.
- If you prefer lighter images, consider creating a dedicated build step that only copies `apps/api` and the necessary `libs` packages.
