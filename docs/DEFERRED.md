# Deferred Decisions

The kernel intentionally leaves these choices open so consuming projects can commit to them later without rewriting the workspace foundation.

## Product Stack

- UI framework
- Design system and component library
- Background jobs and queueing
- Search
- Billing

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
