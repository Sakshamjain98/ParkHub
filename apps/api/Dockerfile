FROM node:18-alpine AS builder
WORKDIR /repo
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn --cwd apps/api build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /repo/apps/api/dist ./dist
COPY --from=builder /repo/apps/api/package.json ./package.json
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/apps/api/prisma ./prisma
COPY --from=builder /repo/apps/api/prisma ./prisma
COPY --from=builder /repo/apps/api/prisma/seed ./prisma/seed
COPY --from=builder /repo/apps/api/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh
EXPOSE 3000
CMD ["./docker-entrypoint.sh"]
