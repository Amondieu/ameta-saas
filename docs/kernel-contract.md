# Kernel Contract

For quickstart, setup, and top-level repo context, see `README.md`.

## Purpose

AMeta-Repo is a reusable TypeScript kernel for API-first projects. It provides workspace tooling, API/docs apps, telemetry, database, auth, test lanes, and CI/security baselines without locking a consuming project into a UI framework, cloud, or deployment target.

## Non-Goals

- Choosing a product UI framework or design system
- Choosing a cloud provider, IaC implementation, or deployment platform
- Adding runtime packages just to support local agent workflows

## Included Surface

- `@repo/schema`: shared Zod contracts and validation helpers
- `@repo/telemetry`: Pino logger and side-effect-free OpenTelemetry bootstrap
- `@repo/database`: Drizzle schema ownership, migrations, seed scripts, Postgres client
- `@repo/auth`: Better Auth factory backed by `@repo/database`
- `@repo/api`: Hono + tRPC composition root, auth routes, request logging, health endpoint
- `@repo/docs`: Starlight docs app for project documentation
- `tests/e2e`: Playwright smoke coverage against the running API

## Deferred Decisions

- UI framework and component system
- Database vendor beyond the local Postgres baseline
- Cloud provider, deployment target, and IaC details
- Remote cache provider
- OAuth providers, email provider, and session scaling strategy

See `docs/DEFERRED.md` for the full deferred contract.

## Package Boundaries

- `@repo/schema`: keep framework-free; do not add DB, auth, or HTTP concerns here.
- `@repo/telemetry`: shared logging and tracing only; do not couple it to app routing or schema code.
- `@repo/database`: owns all Drizzle schema under `packages/database/src/schema`, migrations, and local DB tooling.
- `@repo/auth`: may depend on `@repo/database`; `@repo/database` must never depend on auth.
- `@repo/api`: extend this app for new HTTP routes unless there is a strong reason to create another app.
- `@repo/docs`: docs-only surface; keep it isolated from runtime workspace packages.
- `tests/e2e`: HTTP black-box tests only; do not import runtime packages directly.

## Test Lanes

- `pnpm test`: fast, cacheable unit coverage for in-process code paths.
- `pnpm test:integration`: uncached Postgres-backed checks that require `DATABASE_URL`.
- `pnpm test:e2e`: uncached Playwright smoke tests against a running API.

Keep the API `/health` smoke in the unit lane via `app.request('/health')`. Do not move DB-backed tests into `pnpm test`. See `docs/adr/0003-test-lane-split.md`.

## CI Jobs

- `validate`: secretless lint, type-check, unit test, and build baseline.
- `integration`: starts Postgres, runs migrations, and proves DB-backed tests.
- `e2e`: builds the repo, waits for `/health`, and runs Playwright smoke tests.
- `codeql`: GitHub CodeQL analysis for JavaScript/TypeScript.
- `security-sca`: `audit-ci` software composition scan.

## How To Add Changes Safely

### Add an API Endpoint

1. Add the route or procedure in `apps/api`.
2. Reuse `@repo/schema` types if request or response shapes are shared.
3. Keep request logging and current middleware ordering intact.
4. Add or update unit tests in the default `pnpm test` lane.
5. Update docs if the public API surface changed.

### Add a DB Table

1. Define the table in `packages/database/src/schema`.
2. Generate a Drizzle migration in `packages/database/drizzle`.
3. Update any auth or API consumers through package boundaries, not ad hoc schema copies.
4. Add or update tests in `packages/database`.
5. Run `pnpm test:integration` when Postgres is available.

### Add a Package

1. Place it under `packages/`, `apps/`, `tests/`, or `tooling/` as appropriate.
2. Use `@repo/<name>` naming for internal packages.
3. Add only the dependencies and scripts that match its layer responsibilities.
4. Wire it into Turbo tasks through standard `build`, `lint`, `type-check`, and `test` scripts if applicable.
5. Update this contract, `docs/map.md`, and ADRs if package boundaries changed.
