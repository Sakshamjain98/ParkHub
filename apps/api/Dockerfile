FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy workspace files
COPY package.json yarn.lock ./
COPY .yarn .yarn
COPY .yarnrc.yml .yarnrc.yml
COPY apps apps
COPY libs libs

RUN apk add --no-cache bash git python3 make gcc g++ libc6-compat

# Install all dependencies (yarn workspaces)
# Use a non-frozen install in the Docker build so rendered builds don't fail
# when the lockfile needs to be updated. Update `yarn.lock` in the repo
# separately to re-enable `--frozen-lockfile` if desired.
RUN yarn install --network-timeout 100000 --non-interactive

# Generate Prisma client for API
WORKDIR /usr/src/app/apps/api
RUN npx prisma generate --schema=prisma/schema.prisma

# Build the Nest app
RUN yarn build

FROM node:18-alpine AS runner
WORKDIR /usr/src/app

# Copy built app and node_modules
COPY --from=builder /usr/src/app/apps/api/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/api/package.json ./package.json
COPY --from=builder /usr/src/app/apps/api/prisma ./prisma
COPY --from=builder /usr/src/app/apps/api/prisma/seed ./prisma/seed

ENV NODE_ENV=production
EXPOSE 3000

# Entrypoint will run migrations/seeds then start
COPY apps/api/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
