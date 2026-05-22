# ADR 0003: Split Test Lanes By Runtime Cost

## Status

Accepted

## Context

By Phase 4 the kernel contains three different kinds of validation:

- fast in-process unit tests against exported modules such as the Hono app and shared packages
- database-backed integration tests that require a live Postgres service
- end-to-end browser smoke tests that require a running API and Playwright runtime

Running all of these in one default lane would slow local feedback, encourage mocking away real boundaries, and make CI failures harder to interpret.

## Decision

Split testing into three explicit lanes:

- `pnpm test` for fast, cacheable unit coverage
- `pnpm test:integration` for uncached Postgres-backed checks
- `pnpm test:e2e` for uncached Playwright smoke coverage

The API `/health` smoke remains in the unit lane by using `app.request('/health')` directly against the exported Hono app. Only the database schema integration test requires Postgres. CI mirrors the same split with a secretless `validate` job, then downstream `integration` and `e2e` jobs.

## Consequences

- Contributors get a fast default feedback loop without giving up real integration coverage.
- Integration failures surface as missing-service errors instead of silently passing with mocks.
- CI can keep the base lane secretless while provisioning stateful services only where they are actually needed.
