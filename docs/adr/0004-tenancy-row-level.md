# ADR 0004: Row-Level Multi-Tenancy

## Status

Accepted

## Context

`ameta-saas` is the first derived repo that turns the kernel into a commercially viable SaaS base. The first tenancy model must support multiple workspaces in one deployment while staying simple enough to evolve before domain-specific verticals are added.

## Decision

Adopt row-level multi-tenancy in a single Postgres database as the initial model.

- Key tenant-scoped records carry a `tenantId` column.
- The active tenant flows from auth claims to API request context and then into query helpers.
- Membership and role checks are enforced before tenant-scoped procedures run.

`tenantId` is represented in three places:

- the persisted user record as the current workspace selection
- tenant membership rows that define which users belong to which tenants and roles
- API request context for tenant-scoped procedures

## Constraints

- Do not assume cross-tenant joins are always acceptable just because all data currently lives in one database.
- Do not pass tenant identity as an unvalidated business parameter when it can come from authenticated context.
- Do not couple product code to row-level-only assumptions that would block a future schema-per-tenant or silo model.

## Future Escalation

If a later vertical or compliance requirement needs stronger isolation, this repo can evolve to schema-per-tenant or silo tenancy by:

- keeping tenant resolution centralized in request context and helper packages
- keeping membership checks separate from application business logic
- avoiding accidental cross-tenant data access patterns in shared packages

## Consequences

- `ameta-saas` gets a simple default that works for most B2B SaaS cases.
- Tenant-scoped access becomes testable at the API and database layers.
- Future vertical repos can inherit the model and tighten isolation only if their domain requires it.
