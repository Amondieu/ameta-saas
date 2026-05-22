# Deferred Decisions

AMeta-SaaS now commits to Next.js for the product shell and row-level tenancy for workspace isolation. The decisions below remain intentionally open until the product needs them.

## Product Stack

- Design system and component library
- Background jobs and queueing
- Search
- Billing provider and checkout implementation

## Infrastructure

- Cloud provider
- Deployment target
- Database vendor beyond the local Postgres development baseline
- Infrastructure as code implementation details
- Remote cache provider

## Integration Choices

- OAuth providers
- Email provider
- Session scaling strategy
- Observability backend and collector vendor

## Required Environment

These variables are required once database and auth layers are introduced:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`

`BETTER_AUTH_BASE_URL` remains environment-specific for auth flows. `OTEL_EXPORTER_OTLP_ENDPOINT` is optional locally and only required when a consuming project chooses a concrete telemetry backend.

Each consuming project should record the chosen direction with an ADR before introducing one of these decisions into the workspace.
