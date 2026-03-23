#!/usr/bin/env sh
set -e

echo "Waiting for DATABASE_URL..."
if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL not set, exiting"
  exit 1
fi

echo "Running Prisma migrate deploy..."
npx prisma migrate deploy --schema=prisma/schema.prisma || true

echo "Seeding database (if seed script configured)..."
# Use Prisma db seed which will run the script configured in package.json `prisma.seed`
npx prisma db seed --schema=prisma/schema.prisma || true

echo "Starting application"
node dist/src/main
