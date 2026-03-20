# ParkHub Architecture Handbook

This document provides a comprehensive overview of the ParkHub monorepo, including structure, tech stack, workflows, domain models, business flows, and operational details. For quick setup, see the root README.

---

## 1) Monorepo Structure

ParkHub is a Yarn/Nx monorepo with:

**apps/**
- api: NestJS backend (GraphQL, REST, Prisma, Stripe, Redis)
- web: Customer portal (Next.js, port 3001)
- web-manager: Manager portal (Next.js, port 3002)
- web-valet: Valet portal (Next.js, port 3003)
- web-admin: Admin portal (Next.js, port 3004)

**libs/**
- network: Apollo client, NextAuth config, GraphQL codegen
- forms: Zod + react-hook-form schemas/providers
- ui: Shared UI components/templates
- util: Shared utils, hooks, types
- 3d: React Three Fiber scenes/components
- sample-lib: Placeholder/sample

**Root files:** package.json, nx.json, tsconfig.json

---

## 2) Tech Stack

**Frontend:**
- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS, Material-UI, Emotion
- NextAuth (JWT strategy)
- Apollo Client for GraphQL
- Shared UI system in libs/ui

**Backend:**
- NestJS 9
- Apollo GraphQL + Swagger
- Prisma ORM (PostgreSQL 16)
- Redis (rate limiting, session cache)
- Stripe checkout + signed webhooks

**Shared Layer:**
- libs/network: GraphQL and auth client setup
- libs/forms: schema-driven form logic
- libs/util: helper functions/hooks
- libs/3d: landing page 3D scene

---

## 3) Port and App Matrix

| App | Port | Primary User | Main Purpose |
|---|---:|---|---|
| API (apps/api) | 3000 | System backend | Auth, booking, valet assignment, garage data, Stripe |
| Web (apps/web) | 3001 | Customer | Search garages, checkout, bookings |
| Web Manager (apps/web-manager) | 3002 | Manager | Garage/slot/valet operations |
| Web Valet (apps/web-valet) | 3003 | Valet | Pickup/drop tasks and trip lifecycle |
| Web Admin (apps/web-admin) | 3004 | Admin | Verification and admin operations |

---

## 4) High-Level Architecture Diagram

```mermaid
flowchart TB
  subgraph Clients
    C[Customer Portal\napps/web :3001]
    M[Manager Portal\napps/web-manager :3002]
    V[Valet Portal\napps/web-valet :3003]
    A[Admin Portal\napps/web-admin :3004]
  end

  subgraph Shared_Libs
    N[libs/network\nNextAuth + Apollo + GQL types]
    F[libs/forms\nZod + RHF]
    U[libs/ui\nShared Components/Templates]
    T[libs/util\nHooks + Utils + Types]
  end

  C --> N
  M --> N
  V --> N
  A --> N
  C --> F
  M --> F
  C --> U
  M --> U
  V --> U
  A --> U
  C --> T
  M --> T
  V --> T
  A --> T

  N --> API[API\nNestJS + GraphQL + REST :3000]
  API --> DB[(PostgreSQL)]
  API --> REDIS[(Redis)]
  API --> STRIPE[[Stripe]]
```

---

## 5) Core Backend Domain Model

**Prisma Entities:**
- User, Credentials, AuthProvider, RefreshToken, Customer, Manager, Valet, Admin
- Company, Garage, Address, Slot
- Booking, ValetAssignment, BookingTimeline, Review, Verification

**Booking Statuses:**
- BOOKED
- VALET_ASSIGNED_FOR_CHECK_IN
- VALET_PICKED_UP
- CHECKED_IN
- VALET_ASSIGNED_FOR_CHECK_OUT
- CHECKED_OUT
- VALET_RETURNED

**Relationships:**
- Managers see only their company garages; Valets see company bookings
- Compound indexes for query performance
- Unique constraints for valet/company

---

## 6) User Workflow (Role-wise)

**Customer (Web):**
1. Register/login
2. Search garages (location, time, slot type, price)
3. Select slot, optional valet
4. Pay via Stripe checkout
5. Booking created after Stripe webhook confirmation
6. Track booking in /bookings

**Manager (Web Manager):**
1. Register/login
2. Create garage profile and slots
3. Add/manage valets
4. Monitor bookings for managed garages

**Admin (Web Admin):**
1. Login
2. Review and verify garages
3. Manage admin-level access

**Valet (Web Valet):**
1. Login
2. View pickup/drop tasks
3. Take assignments, progress booking status
4. Complete return flow

---

## 7) Use Case Diagram (Mermaid)

```mermaid
flowchart LR
  Customer((Customer))
  Manager((Manager))
  Valet((Valet))
  Admin((Admin))

  UC1[Search Garages]
  UC2[Create Booking]
  UC3[Pay via Stripe]
  UC4[Track Booking Status]
  UC5[Create Garage and Slots]
  UC6[Manage Valets]
  UC7[View Company Bookings]
  UC8[Pick Up Vehicle]
  UC9[Drop/Return Vehicle]
  UC10[Verify Garage]

  Customer --> UC1
  Customer --> UC2
  Customer --> UC3
  Customer --> UC4

  Manager --> UC5
  Manager --> UC6
  Manager --> UC7

  Valet --> UC8
  Valet --> UC9

  Admin --> UC10
```

---

## 8) End-to-End Business Flow (Customer → Valet)

```mermaid
sequenceDiagram
  autonumber
  actor Customer
  participant Web as Customer Portal
  participant API as ParkHub API
  participant Stripe
  participant DB as PostgreSQL
  participant Manager as Manager Portal
  participant Admin as Admin Portal
  participant Valet as Valet Portal

  Manager->>API: Create garage + slots
  Admin->>API: Verify garage
  API->>DB: Persist verified garage inventory

  Customer->>Web: Search parking options
  Web->>API: GraphQL query for available slots
  API->>DB: Filter garages/slots by window + type
  DB-->>API: Available slots
  API-->>Web: Search results

  Customer->>Web: Submit booking + optional valet details
  Web->>API: Create Stripe checkout session
  API->>Stripe: Create checkout session with metadata
  Stripe-->>Customer: Hosted payment page

  Stripe-->>API: webhook checkout.session.completed
  API->>DB: Create booking + timeline (+ valet assignment if requested)
  API-->>Web: Success redirect target validated

  Valet->>API: Fetch pickup/drop tasks
  API->>DB: Read company-scoped tasks
  DB-->>API: Assigned or assignable tasks
  API-->>Valet: Task list

  Valet->>API: Update assignment/status transitions
  API->>DB: Append booking timeline and new status
  API-->>Web: Updated status visible to customer
```

---

## 9) Technical Data Flow Diagram

```mermaid
flowchart TD
  subgraph Frontend
    FE1[Next.js Portals]
    FE2[NextAuth JWT Session]
    FE3[Apollo Client]
  end

  subgraph API
    A1[Auth Guard + Role Guard]
    A2[GraphQL Resolvers / REST Controllers]
    A3[Domain Services]
    A4[Prisma]
  end

  subgraph Storage_External
    S1[(PostgreSQL)]
    S2[(Redis)]
    S3[[Stripe]]
  end

  FE1 --> FE2 --> FE3
  FE3 --> A1 --> A2 --> A3 --> A4 --> S1
  A1 --> S1
  A2 --> S2
  A3 --> S3
  S3 --> A3
```

---

## 10) Authentication and Authorization

**Authentication:**
- NextAuth (JWT, refresh token rotation)
- API access tokens carry role claims (admin, manager, valet, customer)
- Role restrictions applied in portal middleware and API resolvers
- Row-level checks enforce company/user scoped data access

---

## 11) Local Development Setup

**Prerequisites:**
- Node.js 18+
- Yarn 1.x
- Docker + Docker Compose
- Stripe CLI (optional)

**Install dependencies:**
```bash
yarn install
```

**Start infra:**
```bash
cd apps/api
docker compose up -d
```

**Run API:**
```bash
cd apps/api
yarn dev
```

**Run portals:**
```bash
cd apps/web && yarn dev
cd apps/web-manager && yarn dev
cd apps/web-valet && yarn dev
cd apps/web-admin && yarn dev
```

**Prisma Studio:**
```bash
cd apps/api
yarn prisma studio
```

---

## 12) Environment Variables

**apps/api/.env:**
```
DATABASE_URL=postgresql://postgres:password@localhost:2010/postgres
REDIS_URL=redis://127.0.0.1:6379
NODE_ENV=development
PORT=3000
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_SUCCESS_URL=http://localhost:3001/bookings
STRIPE_CANCEL_URL=http://localhost:3001/booking-failed
BOOKINGS_REDIRECT_URL=http://localhost:3001/bookings
```

**apps/web/.env.local:**
```
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET_CURRENT=replace_with_32_plus_char_secret
NEXT_PUBLIC_API_URL=http://localhost:3000
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

**apps/web-manager/.env.local:**
```
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET_CURRENT=replace_with_32_plus_char_secret
API_URL=http://localhost:3000
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

**apps/web-valet/.env.local:**
```
NEXTAUTH_URL=http://localhost:3003
NEXTAUTH_SECRET_CURRENT=replace_with_32_plus_char_secret
API_URL=http://localhost:3000
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

**apps/web-admin/.env.local:**
```
NEXTAUTH_URL=http://localhost:3004
NEXTAUTH_SECRET_CURRENT=replace_with_32_plus_char_secret
API_URL=http://localhost:3000
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

---

## 13) Useful Commands

**Root:**
```bash
yarn format:write   # Format code
yarn tsc            # TypeScript check
yarn lint           # Lint code
yarn build          # Build all apps
yarn validate       # Full pipeline
yarn cloc           # Count lines of code
```

**apps/api:**
```bash
yarn test           # Unit tests
yarn test:e2e       # E2E tests
yarn entity:gql     # Generate GraphQL DTOs
yarn entity:rest    # Generate REST DTOs
yarn entity:complete
```

---

## 14) Stripe Webhook Testing (Local)

**Stripe CLI:**
```bash
# Terminal 1
cd apps/api && yarn dev
# Terminal 2
stripe listen --forward-to http://localhost:3000/stripe/webhook
# Terminal 3
stripe trigger checkout.session.completed
```
Set the printed whsec_... secret into STRIPE_WEBHOOK_SECRET.

---

## 15) Operational Notes

**Notes:**
- API logs are structured JSON and can be rotated with apps/api/logrotate/parkhub.conf
- GraphQL schema is generated to apps/api/src/schema.gql
- Strong NextAuth secret required (NEXTAUTH_SECRET_CURRENT, min length 32)
- Middleware per portal enforces role-specific access

---

## 16) Current End-to-End Summary

ParkHub’s lifecycle: garage supply onboarding (manager + admin verification) → customer discovery and payment → webhook-confirmed booking creation → valet assignment/execution → booking timeline completion, all enforced with role-aware auth and company-scoped access checks.

---

For detailed explanations, see the root README or this file’s sections above.
