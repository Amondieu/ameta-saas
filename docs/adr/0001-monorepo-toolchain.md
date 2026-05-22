# ADR 0001: Monorepo Toolchain

## Status

Accepted

## Context

The repo is intended to be a reusable kernel rather than a product-specific starter. The first implementation step must prove that workspace linking, shared configuration packages, and CI all work from a clean clone before any application layer is introduced.

## Decision

Use a pnpm workspace orchestrated by Turborepo 2.x on Node 22. Shared configuration is shipped as internal packages under `packages/` and `tooling/`. Local enforcement uses Husky and Commitlint. The initial proof package is `@repo/schema`, which validates workspace linking, typed linting, builds, and tests without pulling in app-layer complexity.

## Consequences

- New packages inherit TypeScript, ESLint, Vitest, Prettier, and Commitlint policy through workspace packages instead of copy-pasted config files.
- CI can run without secrets, Docker, or remote cache.
- Runtime-specific decisions such as Bun, Hono, Better Auth, Drizzle, and Starlight remain deferred until the kernel baseline is stable.
