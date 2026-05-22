# ADR 0005: Use Next.js App Router For The SaaS Shell

## Status

Accepted

## Context

The derived SaaS repo needs a minimal product-facing shell before deeper billing or vertical features are added. The shell must stay a strict API client, avoid direct database or auth package imports, and expose onboarding and tenant-switching flows early enough to validate the backend tenancy design.

## Decision

Use Next.js App Router for `apps/web`.

- `apps/web` consumes the existing API server over HTTP.
- Tenant bootstrap, workspace selection, and settings are implemented as a thin shell first.
- Runtime business logic remains in `apps/api` and shared packages, not in the web app.

## Consequences

- The repo now intentionally commits to a UI framework at the derived-product layer, not at the reusable kernel layer.
- Server components and server actions give the shell a small surface area while keeping API calls explicit.
- A future design system can be layered on top without rewriting the tenancy or auth boundaries.
