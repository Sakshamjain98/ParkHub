#!/usr/bin/env sh
set -e

# If RUN_PRISMA_SETUP is set to "true", run prisma generate, db push and seed
if [ "${RUN_PRISMA_SETUP}" = "true" ]; then
  echo "Running Prisma generate"
  npx prisma generate --schema=prisma/schema.prisma

  echo "Applying Prisma schema to database (db push)"
  npx prisma db push --schema=prisma/schema.prisma --accept-data-loss

  echo "Running Prisma seed"
  npx prisma db seed --schema=prisma/schema.prisma || true
fi

echo "Starting API"
node dist/main.js
