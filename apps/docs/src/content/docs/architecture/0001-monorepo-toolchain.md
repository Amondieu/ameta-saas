---
title: "ADR 0001: Monorepo Toolchain"
description: The workspace foundation chosen for the kernel.
---

## Status

Accepted

## Context

The repository is intended to be a reusable kernel rather than a product-specific starter. The first implementation step needed to prove that workspace linking, shared configuration packages, and CI all work from a clean clone before any deeper application layer is introduced.

## Decision

Use a pnpm workspace orchestrated by Turborepo 2.x on Node 22. Shared configuration is shipped as internal packages under `packages/` and `tooling/`. Local enforcement uses Husky and Commitlint. The first runtime-safe shared package is `@repo/schema`, and the first thin application layers are `apps/api` and `apps/docs`.

## Consequences

- New packages inherit TypeScript, ESLint, Vitest, Prettier, and Commitlint policy through workspace packages instead of copied config files.
- CI runs without secrets, Docker, or remote cache.
- Product-specific choices such as auth providers, database vendors, deployment targets, and observability backends remain deferred.
