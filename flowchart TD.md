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