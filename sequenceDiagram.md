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