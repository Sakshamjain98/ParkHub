# ParkHub Architecture Handbook

This document provides a comprehensive overview of the ParkHub monorepo, including structure, tech stack, workflows, domain models, and business flows. For quick setup, see the root README.

---

## 1) Monorepo Structure

... (see [README.md](../README.md) for full content)

---

## 2) Tech Stack

... (see [README.md](../README.md) for full content)

---

## 3) Port and App Matrix

... (see [README.md](../README.md) for full content)

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

... (see [README.md](../README.md) for full content)

---

## 6) User Workflow (Role-wise)

... (see [README.md](../README.md) for full content)

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

... (see [README.md](../README.md) for full content)

---

## 11) Local Development Setup

... (see [README.md](../README.md) for full content)

---

## 12) Environment Variables

... (see [README.md](../README.md) for full content)

---

## 13) Useful Commands

... (see [README.md](../README.md) for full content)

---

## 14) Stripe Webhook Testing (Local)

... (see [README.md](../README.md) for full content)

---

## 15) Operational Notes

... (see [README.md](../README.md) for full content)

---

## 16) Current End-to-End Summary

... (see [README.md](../README.md) for full content)

---

For detailed explanations, see the root README or this file’s sections above.
