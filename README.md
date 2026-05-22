# AMeta-SaaS

AMeta-SaaS is the first derived product repo built on top of the AMeta kernel. It keeps the shared monorepo, API, docs, telemetry, database, auth, test, and security foundations while adding row-level multi-tenancy, a minimal Next.js App Router shell, and thin billing interfaces for a SaaS baseline.

For architecture, package boundaries, and safe-change rules, see `docs/kernel-contract.md`.

## Included

- `turbo.json` using Turborepo 2.x `tasks`
- pnpm workspace catalogs with `apps/*`, `packages/*`, `tests/*`, and `tooling/*`
- Shared config packages for TypeScript and ESLint
- Shared tooling packages for Vitest, Prettier, and Commitlint
- A proof package at `packages/schema` using Zod v4
- `apps/api` with Hono, the Node adapter, and a thin tRPC v11 surface
- `apps/docs` with Astro Starlight and the kernel contract docs
- `apps/web` with a minimal Next.js App Router shell for workspace bootstrap, tenant switching, and settings
- `packages/telemetry` with Pino logging and side-effect-free OpenTelemetry bootstrap helpers
- `packages/database` with Drizzle, `postgres.js`, migrations, seed scripts, and local Docker Compose
- `packages/auth` with Better Auth wired through the shared database schema
- `packages/tenancy` with helper functions for tenant resolution, membership lookup, and tenant-scoped query filters
- `packages/billing` with provider-agnostic SaaS billing interfaces
- Split test lanes for unit (`pnpm test`), database-backed integration (`pnpm test:integration`), and Playwright E2E (`pnpm test:e2e`)
- `tests/e2e` as a standalone Playwright workspace package for HTTP smoke coverage
- Husky hooks plus Commitlint for local enforcement
- Secretless GitHub Actions CI plus downstream integration and E2E jobs
- GitHub-native security baseline with CodeQL, `audit-ci`, and Dependabot for npm, GitHub Actions, and Docker

## Deferred

- Design system and component library
- Billing provider selection and checkout flows
- Database vendor beyond the local Postgres development baseline
- Cloud provider and release target
- Deployment implementation and IaC modules
- Remote cache provider
- Background jobs, queueing, search, and email provider choices
- OAuth provider mix and long-term session scaling strategy

See `docs/DEFERRED.md` for the full deferred-decision contract.

## Requirements

- Node `22.22.0` via `.nvmrc`
- pnpm `10.33.4` via `packageManager`
- Corepack enabled locally

## Bootstrap

```sh
corepack enable
pnpm install
pnpm dev
pnpm lint
pnpm type-check
pnpm test
pnpm test:integration
pnpm test:e2e
pnpm build
```

`pnpm test:integration` requires a reachable Postgres service via `DATABASE_URL`. `pnpm test:e2e` expects the API to be reachable; outside CI the Playwright config can start it locally.

## Environment Files

Environment templates live in four places:

- `.env.example`
- `packages/database/.env.example`
- `packages/auth/.env.example`
- `apps/web/.env.example`

The shared required variables are `DATABASE_URL` and `BETTER_AUTH_SECRET`. `BETTER_AUTH_BASE_URL` is expected for auth flows, `API_URL` points the Next.js shell at the API server, and `OTEL_EXPORTER_OTLP_ENDPOINT` is optional for local development.

## Current Scope

This repository now implements the reusable kernel plus the first SaaS-specific layer: workspace scaffolding, shared tooling, API/docs applications, telemetry, database, auth, row-level tenancy, a minimal Next.js App Router shell, a thin billing contract, split test lanes, request logging, and the GitHub-native security baseline. Infrastructure and provider decisions remain deferred until the product needs them.
