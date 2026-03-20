# ParkHub Quickstart

This guide helps you set up and run ParkHub locally. For full architecture, workflows, and diagrams, see [docs/architecture.md](docs/architecture.md).

---

## Prerequisites
- Node.js 18+
- Yarn 1.x
- Docker + Docker Compose
- (Optional) Stripe CLI for webhook testing

---

## Setup

1. Clone the repo:
	 ```bash
	 git clone https://github.com/Sakshamjain98/ParkHub.git
	 cd ParkHub
	 ```
2. Install dependencies:
	 ```bash
	 yarn install
	 ```
3. Create `.env` files in each app (see [docs/architecture.md](docs/architecture.md#environment-variables) for details).
4. Start DB/Redis/Nginx:
	 ```bash
	 cd apps/api
	 docker compose up -d
	 ```
5. Run API:
	 ```bash
	 cd apps/api
	 yarn dev
	 ```
6. Run portals (in separate terminals):
	 ```bash
	 cd apps/web && yarn dev
	 cd apps/web-manager && yarn dev
	 cd apps/web-valet && yarn dev
	 cd apps/web-admin && yarn dev
	 ```
7. (Optional) Open Prisma Studio:
	 ```bash
	 cd apps/api
	 yarn prisma studio
	 ```

---

## Useful Commands

From repo root:
```bash
yarn format:write   # Format code
yarn tsc            # TypeScript check
yarn lint           # Lint code
yarn build          # Build all apps
yarn validate       # Full pipeline
yarn cloc           # Count lines of code
```

From `apps/api`:
```bash
yarn test           # Unit tests
yarn test:e2e       # E2E tests
yarn entity:gql     # Generate GraphQL DTOs
yarn entity:rest    # Generate REST DTOs
yarn entity:complete
```

---

## Stripe Webhook Testing (Local)

```bash
# Terminal 1
cd apps/api && yarn dev
# Terminal 2
stripe listen --forward-to http://localhost:3000/stripe/webhook
# Terminal 3
stripe trigger checkout.session.completed
```
Set the printed `whsec_...` secret into `STRIPE_WEBHOOK_SECRET`.

---

## More Info

For full architecture, business flows, and diagrams, see [docs/architecture.md](docs/architecture.md).
