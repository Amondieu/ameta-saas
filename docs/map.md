# Architecture Map

## Package Graph

- `@repo/schema` -> no internal runtime dependencies
- `@repo/telemetry` -> no internal runtime dependencies
- `@repo/database` -> `@repo/telemetry`
- `@repo/auth` -> `@repo/database`
- `@repo/api` -> `@repo/auth`, `@repo/database`, `@repo/schema`, `@repo/telemetry`
- `@repo/docs` -> docs-only app, no internal runtime package dependencies
- `tests/e2e` -> `apps/api` over HTTP only

## CI Graph

```mermaid
flowchart TD
  validate[validate] --> integration[integration]
  integration --> e2e[e2e]
  validate --> codeql[codeql]
  validate --> securitySca[security-sca]
```

## Test Lanes

| Lane | Command | Use it for | Do not put here |
| --- | --- | --- | --- |
| Unit | `pnpm test` | Fast in-process tests for packages and the exported Hono app | Postgres-backed integration checks |
| Integration | `pnpm test:integration` | DB-backed tests that require `DATABASE_URL` and migrations | Pure unit tests or Playwright flows |
| E2E | `pnpm test:e2e` | Playwright smoke coverage against a running API | White-box package tests or direct schema checks |

## Common Placement Rules

- Keep `/health` in the unit lane via `app.request('/health')`.
- Keep Drizzle schema and migration validation in `@repo/database`.
- Keep e2e tests black-box; they should not import runtime workspace code.
