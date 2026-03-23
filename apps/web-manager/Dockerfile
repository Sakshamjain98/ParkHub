FROM node:18-alpine AS builder
WORKDIR /repo
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn --cwd apps/web-manager build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /repo/apps/web-manager/.next .next
COPY --from=builder /repo/apps/web-manager/public ./public
COPY --from=builder /repo/apps/web-manager/package.json ./package.json
COPY --from=builder /repo/node_modules ./node_modules
EXPOSE 3000
CMD ["npx","next","start","-p","3000"]
