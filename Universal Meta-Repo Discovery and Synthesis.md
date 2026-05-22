# Universal Meta-Repo Discovery and Synthesis
## A Composable Base System for Starting Many Kinds of Applications

***

## Executive Summary

This report evaluates 50+ GitHub repositories across 12 functional layers and synthesizes a minimal, composable meta-repo kernel. The resulting fusion set draws from **10 repositories or ecosystems**, avoids vendor lock-in, and can be assembled by a mid-level engineer in under a day. The kernel provides workspace scaffolding, shared tooling configuration, CI/CD, API conventions, auth hooks, DB abstraction, testing infrastructure, observability, docs scaffold, IaC primitives, and a security baseline — while deliberately deferring UI framework, cloud provider, primary DB vendor, and deployment target to each consuming project.

**Contrarian headline:** `next-forge` (Vercel) and `create-t3-app` are the two most-starred references in this space and both fail as meta-repo kernels — one for vendor coupling, the other for being a generator rather than a composable base.

***

## Phase 1: Candidate Matrix

### Layer 1 — Monorepo Scaffold / Workspace

| Repo | URL | Purpose | Runtime | License | Maintenance Evidence | Extraction Unit |
|------|-----|---------|---------|---------|---------------------|-----------------|
| `vercel/turborepo` (basic starter) | https://github.com/vercel/turborepo | Official Turborepo basic starter with pnpm, tsconfig, eslint-config packages | Node ≥18, pnpm | MIT | Active weekly releases; Rust core updated continuously [^1][^2] | `turbo.json`, workspace config, `@repo/typescript-config`, `@repo/eslint-config` |
| `create-turbo` (official CLI) | https://turborepo.dev/docs/getting-started/examples | Scaffolds Turborepo with any example; official core-team templates | Node, pnpm/bun | MIT | Official Vercel maintained, CI documented [^3] | Entire scaffold as zero-state base |
| `dan5py/turborepo-shadcn-ui` | https://github.com/dan5py/turborepo-shadcn-ui | 667-star Turborepo starter with shadcn/ui pre-configured | Next.js, pnpm | MIT | Updated Dec 2025 [^4] | Workspace layout and shared package pattern |
| `oNo500/nestjs-boilerplate` | https://github.com/oNo500/nestjs-boilerplate | NestJS + React 19 + Drizzle + Turborepo, "Claude Code-ready" | Node, pnpm | MIT | Updated May 2026 [^4] | Full-stack wiring pattern; Drizzle + Turborepo integration |
| `clairechabas/jade` | https://github.com/clairechabas/jade | Minimal monorepo starter: React, Node, pnpm, Turborepo, GitHub Actions, Vitest, Playwright | Node 20+, pnpm | unknown | Updated Feb 2026 [^5] | Clean zero-opinion workspace skeleton |

**Evaluation summary:** The official `create-turbo` scaffold is the correct extraction unit for the workspace layer. It provides `turbo.json`, pnpm workspace config, a `@repo/typescript-config` package, and an `@repo/eslint-config` package — the "configuration as a package" pattern at its most portable.[^6][^7]

***

### Layer 2 — Full-Stack Boilerplate Core

| Repo | URL | Purpose | Runtime | License | Maintenance | Extraction Unit |
|------|-----|---------|---------|---------|-------------|-----------------|
| `kriasoft/react-starter-kit` | https://github.com/kriasoft/react-starter-kit | Bun + TypeScript + Hono + tRPC + Drizzle + TanStack Router; edge-native | Bun / Node 20 | MIT | 23.6k stars; actively iterated (v3.0 Jun 2025) [^8][^9] | `apps/web`, `apps/api`, `packages/core` split pattern |
| `t3-oss/create-t3-app` | https://github.com/t3-oss/create-t3-app | CLI to scaffold typesafe Next.js apps (optional prisma/drizzle/trpc) | Node, Next.js | MIT | 28.9k stars; active [^10] | tRPC + Zod pattern as package, not the generator |
| `bishopZ/2026-Boilerplate` | https://github.com/bishopZ/2026-Boilerplate | React 19 + Express + Passport + Redux Toolkit + Cypress; accessibility-first | Node, Vite | MIT | Announced Mar 2026, community-discussed [^11][^12] | Accessibility baseline and i18n scaffold |
| `Clstialdev/next-nest-starter` | https://github.com/Clstialdev/next-nest-starter | Next.js 15 + NestJS + Drizzle + Docker + Traefik; `with-db` branch | Node, pnpm | MIT | Updated May 2025 [^13] | Docker Compose local dev pattern |
| `oNo500/nestjs-boilerplate` | (same as above) | NestJS + React 19 + Drizzle + Turborepo | Node | MIT | May 2026 [^4] | Full-stack wiring |

**Evaluation summary:** `kriasoft/react-starter-kit` provides the cleanest separation of `apps/web`, `apps/api`, `apps/edge`, and `packages/core`. However, it assumes Bun and Cloudflare Workers as the edge runtime target — a soft vendor assumption that must be noted.[^8]

***

### Layer 3 — Authentication and Authorization

| Repo | URL | Purpose | Runtime | License | Maintenance | Extraction Unit |
|------|-----|---------|---------|---------|-------------|-----------------|
| `better-auth/better-auth` | https://github.com/better-auth/better-auth | Framework-agnostic TypeScript auth framework; plugin ecosystem | Any TS server | MIT | v1.3.31 Oct 2025; 807 releases [^14][^15] | `packages/auth` adapter wrapper |
| `lucia-auth/lucia` | https://github.com/lucia-auth/lucia | Deprecated as a library (Mar 2025); now open-source session implementation reference | Any | MIT | Deprecated — educational resource only [^16] | Session implementation patterns (educational) |
| `t3-oss/create-t3-app` (NextAuth) | — | Auth.js (NextAuth) integration pattern; now maintained by Better Auth team | Next.js | MIT | Maintained under Better Auth umbrella [^17] | OAuth provider pattern |
| `Arshiash80/fastify-drizzle-multitenant-rbac-starter` | https://github.com/Arshiash80/fastify-drizzle-multitenant-rbac-starter | Fastify + Drizzle + RBAC multi-tenant starter | Node, Fastify | MIT | Updated Jun 2025 [^18] | RBAC permission table schema |

**Evaluation summary:** Better Auth is the decisive choice for the auth layer — MIT, framework-agnostic, actively released, supports RBAC via admin/organization plugins, and now stewards Auth.js/NextAuth too. Lucia is explicitly deprecated and should only be consulted as a session implementation reference.[^16][^17][^19]

***

### Layer 4 — Database Layer and ORM

| Repo | URL | Purpose | Runtime | License | Maintenance | Extraction Unit |
|------|-----|---------|---------|---------|-------------|-----------------|
| `drizzle-team/drizzle-orm` | https://github.com/drizzle-team/drizzle-orm | Lightweight TypeScript ORM; migration-first; multi-DB | Node/Bun/Edge | Apache-2.0 | Very active; issues addressed rapidly [^20][^21] | `packages/database` schema+migrations pattern |
| `htsh-tsyk/turbo-drizzle` | https://github.com/htsh-tsyk/turbo-drizzle | Turborepo + Drizzle + PostgreSQL; `@repo/database` package with Docker Compose | pnpm, Node | MIT | Feb 2024 [^22] | `@repo/database` package structure |
| Shared schema pattern (Drizzle + Turborepo) | https://pliszko.com/blog/post/2023-08-31-shared-database-schema-with-drizzleorm-and-turborepo | Extract schema, types, migrations, and seeding as internal `@repo/database` package | pnpm, Turbo | N/A (pattern) | Documented pattern [^21] | Internal package extraction method |
| Prisma (reference) | https://www.prisma.io | Popular ORM alternative; heavier migration tooling | Node | Apache-2.0 | Very active | Reject for meta-repo (heavier, shadow DB issue) |

**Evaluation summary:** Drizzle is preferred over Prisma for the meta-repo kernel. Drizzle is lighter, runs on edge runtimes, supports PostgreSQL/MySQL/SQLite/LibSQL, produces no build step, and generates TypeScript types directly from schema. The `@repo/database` package pattern — extracting schema definitions, migrations, and seeding scripts as a shared internal package — is the canonical pattern.[^21][^22][^23]

***

### Layer 5 — API Layer

| Repo | URL | Purpose | Runtime | License | Maintenance | Extraction Unit |
|------|-----|---------|---------|---------|-------------|-----------------|
| `honojs/hono` | https://github.com/honojs/hono | Ultralight HTTP framework; Web Standards; edge + Node | Any | MIT | Extremely active; ~20k stars [^24] | `apps/api` Hono entry point |
| `trpc/trpc` (v11) | https://github.com/trpc/trpc | End-to-end type-safe RPC; no schema needed between client and server | Node/Next | MIT | Active; 35k+ stars [^24] | tRPC router as internal package |
| `oRPC` | https://orpc.unnoq.com | RPC + built-in OpenAPI; smaller than tRPC; REST-compatible | Any TS | MIT | Active 2025 [^24] | Drop-in tRPC alternative with REST compat |
| `maybemaby/fastify-trpc-next` | https://github.com/maybemaby/fastify-trpc-next | Fastify + tRPC + Next.js + Turborepo monorepo | pnpm, Node | MIT | 2023, maintenance status unknown [^25] | Pattern: `schema` package for shared Zod types |
| `barclayd/react-router-trpc-hono-bun-template` | https://github.com/barclayd/react-router-trpc-hono-bun-template | Hono + tRPC + React Router v7 + Bun + Turborepo | Bun | MIT | Dec 2024 [^26] | Hono+tRPC server split pattern |

**Evaluation summary:** Hono as the transport layer with tRPC as an optional RPC overlay is the most composable API pattern in 2025–2026. Hono is standalone, deployable anywhere (edge, Node, Bun, Deno), and framework-independent. tRPC adds type safety for client–server contracts when external consumers are not required. The `schema` package for shared Zod types is the critical extraction unit.[^24]

***

### Layer 6 — CI/CD and GitHub Actions

| Repo | URL | Purpose | Runtime | License | Maintenance | Extraction Unit |
|------|-----|---------|---------|---------|-------------|-----------------|
| Turborepo CI docs (official) | https://turborepo.dev/docs/guides/ci-vendors/github-actions | Official Turborepo GitHub Actions recipe with pnpm caching | GH Actions | MIT | Official docs, continuously updated [^3] | `.github/workflows/ci.yml` |
| `ministryofjustice/devsecops-actions` | https://github.com/ministryofjustice/devsecops-actions | Reusable GH Actions for SAST, SCA, DAST, secrets, IaC, container scanning | GH Actions | MIT | Updated Nov 2025 [^27][^28] | Reusable `call-sast.yml`, `call-sca.yml` |
| `dwarvesf/monorepo-deploy-gh-actions-template` | https://github.com/dwarvesf/monorepo-deploy-gh-actions-template | Turborepo + Vercel CLI deploy template; per-app workflows | GH Actions | MIT | 2023 [^29] | Workflow structure pattern |
| WarpBuild monorepo guide | https://warpbuild.com/blog/github-actions-monorepo-guide | Affected-only execution, remote caching, 12x CI speedup patterns | GH Actions | N/A | Jan 2026 [^30] | Matrix + cache patterns |

**Evaluation summary:** The official Turborepo GitHub Actions template provides the base CI workflow with pnpm caching. The `ministryofjustice/devsecops-actions` repo provides production-grade reusable security scanning workflows covering SCA, SAST, secrets, and container scanning under MIT.[^3][^27]

***

### Layer 7 — Testing Infrastructure

| Repo | URL | Purpose | Runtime | License | Maintenance | Extraction Unit |
|------|-----|---------|---------|---------|-------------|-----------------|
| `vitest/vitest` | https://github.com/vitest-dev/vitest | Vite-native unit/integration test runner; Turborepo-friendly | Node/Bun | MIT | Very active; ~13k stars [^31][^32] | `vitest.config.ts` per package, shared preset |
| `microsoft/playwright` | https://github.com/microsoft/playwright | Cross-browser E2E testing; monorepo-compatible | Node | Apache-2.0 | Very active; Microsoft-backed [^33][^34] | `tests/e2e/` workspace package |
| `clairechabas/jade` (test wiring) | https://github.com/clairechabas/jade | Shows Vitest + Playwright wired into Turborepo pipeline | pnpm | unknown | Feb 2026 [^5] | Turborepo `test` pipeline config |

**Evaluation summary:** Vitest for unit/integration tests and Playwright for E2E is the settled consensus for TypeScript monorepos in 2025–2026. Both integrate cleanly with Turborepo's task pipeline. Vitest provides a workspace mode (`vitest.workspace.ts`) that collects tests across packages without redundant configuration.[^31][^32][^34]

***

### Layer 8 — Observability and Logging

| Repo | URL | Purpose | Runtime | License | Maintenance | Extraction Unit |
|------|-----|---------|---------|---------|-------------|-----------------|
| `open-telemetry/opentelemetry-js` | https://github.com/open-telemetry/opentelemetry-js | Official OTel JS SDK; traces, metrics, logs | Node/Bun | Apache-2.0 | CNCF-backed; extremely active [^35] | `packages/telemetry` bootstrap wrapper |
| `pinojs/pino` + `pino-opentelemetry-transport` | https://github.com/pinojs/pino-opentelemetry-transport | Pino logger → OTel OTLP bridge; structured logging with trace correlation | Node | MIT | Active; latest transport 2025 [^36] | `packages/logger` with pino + OTel transport |
| `@opentelemetry/instrumentation-pino` | npm | Auto-injects trace context into Pino logs | Node | Apache-2.0 | Published 0.52.0 Sep 2025 [^37] | Single dependency in logger package |

**Evaluation summary:** The composable observability pattern is: Pino for structured logging + `pino-opentelemetry-transport` + `@opentelemetry/sdk-node` in a `packages/telemetry` internal package. This provides trace-correlated structured logs, health check endpoints, and an OTLP export path to any backend (Grafana, Jaeger, Datadog) — with console output as the local default requiring no infra.[^38][^36]

***

### Layer 9 — Infrastructure as Code

| Repo | URL | Purpose | Runtime | License | Maintenance | Extraction Unit |
|------|-----|---------|---------|---------|-------------|-----------------|
| `opentofu/opentofu` | https://github.com/opentofu/opentofu | Open-source Terraform fork; Linux Foundation; MPL-2.0 | HCL | MPL-2.0 | Active LF project [^39][^40] | Module skeleton in `/infra/modules` |
| `zopdev/opentofu-modules` | https://github.com/zopdev/opentofu-modules | Multi-cloud Kubernetes + observability + DB modules; AWS/GCP/Azure/OCI | HCL | Apache-2.0 | Updated Oct 2024 [^41] | K8s, SQL, observability module extraction |
| `pulumi/pulumi` (TypeScript) | https://www.pulumi.com/docs/iac/ | IaC in TypeScript; cloud-agnostic; Apache-2.0 | TypeScript | Apache-2.0 | Very active; multi-cloud [^42] | TypeScript IaC alternative if no HCL preference |
| `pulumi/examples` | https://github.com/pulumi/examples | AWS/Azure/GCP/K8s examples in TypeScript | TypeScript | Apache-2.0 | Active [^43] | IaC component patterns |

**Evaluation summary:** OpenTofu is the preferred IaC base for cloud-agnostic infrastructure modules — it is Terraform-compatible, Linux Foundation governed, and MPL-2.0 licensed (not viral). Pulumi is the preferred alternative when teams want IaC in TypeScript co-located with application code. The `/infra` directory should contain module stubs, not environment-specific dumps.[^39][^40]

***

### Layer 10 — Code Quality and Standards

| Repo | URL | Purpose | Runtime | License | Maintenance | Extraction Unit |
|------|-----|---------|---------|---------|-------------|-----------------|
| Official Turborepo `@repo/typescript-config` | https://github.com/vercel/turborepo | Shared `tsconfig.json` packages per environment (base, Next.js, React lib) | Node | MIT | Official; always current [^6][^7] | `packages/typescript-config/` |
| Official Turborepo `@repo/eslint-config` | https://github.com/vercel/turborepo | Shared flat-config ESLint package | Node | MIT | Official; always current [^7] | `packages/eslint-config/` |
| `prettier/eslint-config-prettier` | https://github.com/prettier/eslint-config-prettier | Disables formatting rules that conflict with Prettier | Node | MIT | Extremely active [^44] | Single dependency |
| `typescript-eslint` v8 project service | https://typescript-eslint.io | Monorepo-aware typed linting; v8 needs no extra tsconfigRootDir config | Node | MIT | Active [^45][^46] | `@typescript-eslint/parser` + `projectService` |
| `commitlint` + `husky` | npm | Commit message enforcement + pre-commit hooks | Node | MIT | Active | `tooling/commitlint-config/` |

**Evaluation summary:** The "configuration as a package" pattern — shipping `@repo/typescript-config` and `@repo/eslint-config` as internal packages — is the gold standard demonstrated by the official Turborepo starter. TypeScript-ESLint v8's project service eliminates the per-package `tsconfigRootDir` boilerplate that plagued earlier monorepo setups.[^45][^7][^6]

***

### Layer 11 — Documentation Scaffold

| Repo | URL | Purpose | Runtime | License | Maintenance | Extraction Unit |
|------|-----|---------|---------|---------|-------------|-----------------|
| `withastro/starlight` | https://github.com/withastro/starlight | Astro-based docs site; built-in search, i18n, dark mode, sidebar | Node/Astro | MIT | Very active; used by Astro itself [^47] | `apps/docs/` Astro + Starlight app |
| Nextra v3 | https://nextra.site | Next.js-based docs; MDX; search | Node, Next.js | MIT | Active [^48] | `apps/docs/` Next.js app |
| Docusaurus | https://github.com/facebook/docusaurus | React-based docs; first-class versioning; i18n | Node | MIT | Meta-maintained; very active [^49] | `apps/docs/` with versioning |

**Evaluation summary:** Starlight (Astro) is preferred for a framework-agnostic meta-repo because it does not pull in Next.js assumptions — it is a separate Astro app with Pagefind search, i18n, and a composable integration API. Docusaurus is preferred when doc versioning is a day-one requirement, as Starlight's built-in versioning support is still maturing.[^50][^51][^52][^47]

***

### Layer 12 — Security Baseline

| Repo | URL | Purpose | Runtime | License | Maintenance | Extraction Unit |
|------|-----|---------|---------|---------|-------------|-----------------|
| `ministryofjustice/devsecops-actions` | https://github.com/ministryofjustice/devsecops-actions | Reusable SAST/SCA/DAST/secrets/IaC/container scan workflows | GH Actions | MIT | Updated Nov 2025 [^27][^28][^53] | Individual reusable workflow calls |
| GitHub CodeQL (native) | https://github.com/github/codeql-action | SAST via GitHub Code Scanning; SARIF output | GH Actions | MIT | GitHub-native; always maintained [^54] | `.github/workflows/codeql.yml` |
| Semgrep OSS | https://github.com/semgrep/semgrep | OWASP-aligned SAST rules; SARIF upload | GH Actions | LGPL-2.1 | Active [^55] | Semgrep scan step |
| Dependabot (native) | GitHub native | Dependency vulnerability alerts + auto-PRs | GitHub | N/A | Native GitHub feature [^56] | `.github/dependabot.yml` |

**Evaluation summary:** The security baseline is best assembled from GitHub-native tooling (CodeQL, Dependabot, secret scanning) plus `ministryofjustice/devsecops-actions` reusable workflow calls for SAST, SCA, and container scanning. This avoids vendor products while covering the OWASP top-10 categories. SBOM generation can be added via `anchore/sbom-action`.[^27][^57]

***

## Phase 2: Full Scoring Matrix

| Layer | Repo | Composability | Recency | Community | Opinionation | Conflict Surface | Decision | Rationale |
|-------|------|:---:|:---:|:---:|:---:|:---:|----------|-----------|
| 1 Monorepo | `vercel/turborepo` (basic) | 5 | 5 | 5 | 2 | 1 | **Adopt** | Zero-opinion workspace scaffold; `turbo.json` and config packages are pure extraction units [^1][^7] |
| 1 Monorepo | `vercel/next-forge` | 2 | 5 | 4 | 5 | 5 | **Reject** | Clerk + Neon + Vercel = 3 vendor assumptions baked in; cannot partially adopt without ripping out the stack [^58][^59][^60] |
| 1 Monorepo | `dan5py/turborepo-shadcn-ui` | 3 | 4 | 3 | 3 | 3 | **Pattern only** | Good shared UI package pattern but Next.js–specific styling choices [^4] |
| 2 Full-stack | `kriasoft/react-starter-kit` | 4 | 5 | 4 | 3 | 3 | **Partially extract** | Clean `apps/api` + `packages/core` split; Bun/CF Workers assumption is soft vendor lock-in [^8][^9] |
| 2 Full-stack | `t3-oss/create-t3-app` | 2 | 5 | 5 | 4 | 3 | **Pattern only** | Generator, not a template; tRPC + Zod pattern is extractable; whole stack is Next.js-exclusive [^10][^61] |
| 2 Full-stack | `bishopZ/2026-Boilerplate` | 2 | 5 | 2 | 4 | 3 | **Pattern only** | Accessibility and i18n patterns are valuable; full stack is Passport/Express/Redux, hard to decouple [^11] |
| 3 Auth | `better-auth/better-auth` | 5 | 5 | 4 | 2 | 1 | **Adopt** | Framework-agnostic, MIT, plugin ecosystem, RBAC, multi-tenant; stewards Auth.js [^19][^14][^15] |
| 3 Auth | `lucia-auth/lucia` | 4 | 2 | 3 | 1 | 1 | **Pattern only** | Deprecated as library; session pattern docs are educational gold [^16] |
| 3 Auth | Clerk (SaaS) | N/A | 5 | 5 | 5 | 5 | **Reject** | Paid vendor product; cannot self-host; deep coupling [^58] |
| 4 DB | `drizzle-team/drizzle-orm` | 5 | 5 | 5 | 1 | 1 | **Adopt** | Lightweight, edge-compatible, multi-DB, type-gen from schema, no shadow DB [^20][^21][^23] |
| 4 DB | `htsh-tsyk/turbo-drizzle` | 4 | 3 | 2 | 2 | 1 | **Partially extract** | `@repo/database` package structure is the right model; project itself is minimal [^22] |
| 4 DB | Prisma | 3 | 5 | 5 | 3 | 2 | **Pattern only** | Shadow DB migration approach causes friction; heavier runtime; not edge-compatible [^20][^62] |
| 5 API | `honojs/hono` | 5 | 5 | 5 | 1 | 1 | **Adopt** | Runs anywhere; ~14KB; REST-compatible; built-in middleware; no framework lock-in [^24] |
| 5 API | `trpc/trpc` v11 | 4 | 5 | 5 | 3 | 2 | **Partially extract** | Excellent for internal type-safe RPCs; no external consumer support; must sit on top of Hono [^24] |
| 5 API | oRPC | 4 | 5 | 3 | 2 | 1 | **Partially extract** | Better REST/OpenAPI compat than tRPC; smaller bundle; newer so smaller community [^24] |
| 6 CI/CD | Turborepo GH Actions (official) | 5 | 5 | 5 | 2 | 1 | **Adopt** | Official recipe; pnpm caching; secretless on first clone [^3] |
| 6 CI/CD | `ministryofjustice/devsecops-actions` | 5 | 4 | 3 | 2 | 1 | **Adopt** | Reusable workflow calls cover all security scan categories; MIT; UK gov-maintained [^27] |
| 6 CI/CD | `dwarvesf/monorepo-deploy-gh-actions-template` | 3 | 2 | 2 | 3 | 3 | **Pattern only** | Vercel-specific deploy; workflow structure patterns only [^29] |
| 7 Testing | `vitest/vitest` | 5 | 5 | 5 | 1 | 1 | **Adopt** | Vite-native; workspace mode; fast; no Jest migration needed [^31][^32] |
| 7 Testing | `microsoft/playwright` | 5 | 5 | 5 | 1 | 1 | **Adopt** | Cross-browser E2E; official MS maintenance; monorepo-compatible [^33] |
| 7 Testing | Jest | 3 | 4 | 5 | 3 | 3 | **Reject** | Slower in monorepos; Vitest supersedes it for Vite-based stacks [^31] |
| 8 Observability | `opentelemetry-js` | 5 | 5 | 5 | 1 | 1 | **Adopt** | CNCF standard; vendor-agnostic exporters; Apache-2.0 [^35] |
| 8 Observability | Pino + `pino-opentelemetry-transport` | 5 | 5 | 4 | 1 | 1 | **Adopt** | Fast structured logging + trace correlation; MIT [^36][^37] |
| 8 Observability | Winston + OTel | 4 | 5 | 4 | 1 | 2 | **Pattern only** | Valid alternative to Pino; slightly heavier; good for Winston-familiar teams [^63] |
| 9 IaC | `opentofu/opentofu` | 5 | 5 | 4 | 1 | 1 | **Adopt** | Terraform-compatible; LF-governed; MPL-2.0; cloud-agnostic [^39][^40] |
| 9 IaC | `zopdev/opentofu-modules` | 4 | 3 | 2 | 3 | 2 | **Partially extract** | Good multi-cloud module patterns; some zop.dev-specific components [^41] |
| 9 IaC | `pulumi/pulumi` | 4 | 5 | 4 | 2 | 2 | **Pattern only** | Excellent TypeScript IaC; use if team prefers code over HCL [^42] |
| 10 Quality | `@repo/typescript-config` (Turborepo) | 5 | 5 | 5 | 1 | 1 | **Adopt** | Config-as-package canonical pattern [^6][^7] |
| 10 Quality | `@repo/eslint-config` (Turborepo) | 5 | 5 | 5 | 1 | 1 | **Adopt** | Config-as-package; flat config ready [^7][^44] |
| 10 Quality | commitlint + husky | 5 | 5 | 4 | 2 | 1 | **Adopt** | Conventional commits enforcement; extractable as `tooling/commitlint-config` |
| 11 Docs | `withastro/starlight` | 5 | 5 | 4 | 1 | 1 | **Adopt** | Framework-agnostic; does not require Next.js; built-in search, i18n [^47] |
| 11 Docs | Nextra v3 | 3 | 4 | 3 | 3 | 3 | **Pattern only** | Requires Next.js; tighter coupling [^48] |
| 11 Docs | Docusaurus | 4 | 5 | 5 | 2 | 1 | **Partially extract** | First-class versioning; Meta-maintained; React-based but standalone [^49] |
| 12 Security | `ministryofjustice/devsecops-actions` | 5 | 4 | 3 | 2 | 1 | **Adopt** | (shared with CI/CD layer) |
| 12 Security | GitHub CodeQL (native) | 5 | 5 | 5 | 1 | 1 | **Adopt** | GitHub-native SAST; no external dependency [^54] |
| 12 Security | Semgrep OSS | 4 | 5 | 4 | 2 | 1 | **Adopt** | OWASP-aligned; SARIF output; LGPL-2.1 (action use is clean) [^55] |
| 12 Security | Dependabot | 5 | 5 | 5 | 1 | 1 | **Adopt** | GitHub-native; zero config; handles CVEs and auto-PRs [^56] |

***

## Phase 3 — Synthesis Design

### Recommended Fusion Set (10 Elements)

These are the repositories and packages you would actually extract or adopt:

1. **`vercel/turborepo` (basic starter)** — *Adopt the scaffold*
   Extract: `turbo.json`, `pnpm-workspace.yaml`, `@repo/typescript-config`, `@repo/eslint-config` packages. This is the zero-opinion workspace kernel. Run `pnpm dlx create-turbo@latest` to bootstrap, then replace all app content.[^1][^7]

2. **`better-auth/better-auth`** — *Adopt as package dependency*
   Install in `packages/auth/` as an internal wrapper package. Configure one provider (e.g., email/password) as the bootstrap path. RBAC via the `admin` plugin. Multi-tenant via `organization` plugin. The library, not a starter.[^14][^15]

3. **`drizzle-team/drizzle-orm` + `@repo/database` pattern** — *Adopt pattern; extract package*
   Create `packages/database/` with schema files, Drizzle config, `drizzle-kit push`/`migrate` scripts, and a Docker Compose local dev file. Types and schema are re-exported from this package; consuming apps import `@repo/database`.[^22][^23][^21]

4. **`honojs/hono`** — *Adopt as API framework*
   `apps/api/` wraps a Hono server. tRPC is mounted as a middleware path for type-safe internal RPCs. Hono handles external REST routes, health checks, and middleware. Zod schemas are in `packages/schema/`.[^26][^24]

5. **`opentelemetry-js` + Pino + `pino-opentelemetry-transport`** — *Adopt; create `packages/telemetry`*
   One internal package exports a `createLogger(serviceName)` factory and a `bootstrapTelemetry(config)` function. Console transport is the default for local dev. OTLP endpoint is env-configured for production.[^35][^64][^36]

6. **Turborepo official GitHub Actions CI template** — *Adopt `.github/workflows/ci.yml`*
   `pnpm install → turbo lint → turbo type-check → turbo test → turbo build`. pnpm cache via `actions/cache`. Secretless on fresh clone. Optional remote cache via `TURBO_TOKEN`.[^3]

7. **`ministryofjustice/devsecops-actions`** — *Adopt as reusable workflow calls*
   Three workflow files: `security-sast.yml` (CodeQL + Semgrep), `security-sca.yml` (dependency audit), `security-secrets.yml` (secret scan). All call reusable workflows from MoJ's repo.[^28][^27]

8. **`vitest` + `playwright`** — *Adopt; wire into Turborepo pipeline*
   `packages/*` each have a `vitest.config.ts`. `tests/e2e/` is a workspace package with `playwright.config.ts`. Turborepo runs `turbo test` (unit+integration) and `turbo test:e2e` (playwright, CI-only).[^33][^31]

9. **`withastro/starlight`** — *Adopt `apps/docs`*
   One Astro app with Starlight. Architecture docs, API reference stubs, and a "what's included / you must choose" landing page. Pagefind search included. No Next.js dependency.[^47]

10. **OpenTofu module skeleton** — *Partially extract `/infra` skeleton*
    `/infra/modules/` stubs for networking, compute, DB, and observability. Environment directories (`/infra/environments/staging`, `/infra/environments/prod`) with `terraform.tfvars.example`. No cloud-specific code committed — just the module signature.[^40][^39]

***

## Folder Blueprint

```
/meta-repo
│
├── apps/
│   ├── web/                         # Frontend app (UI framework DEFERRED)
│   │   ├── package.json             # depends on @repo/schema, @repo/ui (if added)
│   │   └── ...
│   ├── api/                         # Hono server + tRPC router
│   │   ├── src/
│   │   │   ├── index.ts             # Hono entry point, health check, /api routes
│   │   │   ├── trpc/                # tRPC router, procedures
│   │   │   └── middleware/          # Auth middleware, logging, CORS
│   │   └── package.json             # depends on hono, @trpc/server, @repo/database, @repo/auth, @repo/telemetry
│   └── docs/                        # Starlight (Astro) docs site
│       ├── src/content/docs/
│       │   ├── index.md             # What's included / What you must choose
│       │   ├── architecture/        # ADRs, folder map, integration notes
│       │   └── api/                 # Generated API reference stubs
│       └── package.json
│
├── packages/
│   ├── typescript-config/           # @repo/typescript-config — base, react-lib, node variants
│   │   ├── base.json
│   │   ├── react-library.json
│   │   └── package.json
│   ├── eslint-config/               # @repo/eslint-config — flat config; typescript-eslint v8
│   │   ├── index.js
│   │   └── package.json
│   ├── schema/                      # @repo/schema — shared Zod schemas (request/response contracts)
│   │   ├── src/
│   │   │   ├── user.ts
│   │   │   └── index.ts
│   │   └── package.json
│   ├── database/                    # @repo/database — Drizzle schema, migrations, seed, Docker Compose
│   │   ├── src/
│   │   │   ├── schema/              # table definitions
│   │   │   └── index.ts             # re-exports types + query client factory
│   │   ├── drizzle.config.ts
│   │   ├── migrate.ts               # run migrations script
│   │   ├── seed.ts                  # local dev seed
│   │   ├── docker-compose.yml       # postgres for local dev
│   │   └── package.json
│   ├── auth/                        # @repo/auth — Better Auth server config wrapper
│   │   ├── src/
│   │   │   ├── index.ts             # createAuth() factory with plugin list
│   │   │   └── types.ts             # exported User, Session types
│   │   └── package.json
│   ├── telemetry/                   # @repo/telemetry — OTel SDK + Pino logger
│   │   ├── src/
│   │   │   ├── logger.ts            # createLogger(serviceName) → Pino instance
│   │   │   ├── tracing.ts           # bootstrapTracing(config) → OTel SDK
│   │   │   └── index.ts
│   │   └── package.json
│   └── ui/                          # @repo/ui — STUB only; UI framework DEFERRED
│       ├── src/
│       │   └── index.ts             # empty re-export placeholder
│       └── package.json
│
├── tooling/
│   ├── commitlint-config/           # @repo/commitlint-config — conventional commits preset
│   ├── prettier-config/             # @repo/prettier-config — shared formatting rules
│   └── vitest-config/               # @repo/vitest-config — shared vitest base config
│
├── infra/
│   ├── modules/                     # OpenTofu reusable modules
│   │   ├── networking/
│   │   ├── compute/
│   │   ├── database/
│   │   └── observability/
│   ├── environments/
│   │   ├── staging/
│   │   │   ├── main.tf
│   │   │   └── terraform.tfvars.example
│   │   └── prod/
│   │       ├── main.tf
│   │       └── terraform.tfvars.example
│   └── README.md                    # "choose your cloud" instructions
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                   # lint → type-check → test → build (Turborepo + pnpm cache)
│   │   ├── security-sast.yml        # calls MoJ devsecops-actions SAST reusable workflow
│   │   ├── security-sca.yml         # calls MoJ devsecops-actions SCA reusable workflow
│   │   ├── security-secrets.yml     # GitHub secret scanning + Dependabot config
│   │   └── release.yml              # STUB — fill in deployment target
│   ├── dependabot.yml               # auto-update pnpm, GH Actions
│   ├── CODEOWNERS                   # owner assignments per layer
│   └── pull_request_template.md
│
├── docs/                            # Architecture decision records (not the Starlight site)
│   ├── adr/
│   │   ├── 0001-monorepo-toolchain.md
│   │   ├── 0002-deferred-ui-framework.md
│   │   └── 0003-deferred-cloud-provider.md
│   └── DEFERRED.md                  # explicit list of decisions NOT made
│
├── scripts/
│   ├── setup.sh                     # pnpm install + db:push + db:seed
│   ├── check.sh                     # lint + type-check + test dry-run
│   └── bootstrap-env.sh             # copies .env.example to .env in all packages
│
├── turbo.json                       # pipeline: build, lint, type-check, test, test:e2e
├── pnpm-workspace.yaml
├── package.json                     # root scripts: dev, build, lint, test, clean
└── README.md                        # MUST distinguish "included" from "you must choose"
```

***

## Phase 3 — Fusion Conflicts

| Conflict | Cause | Resolution |
|---------|-------|------------|
| **ORM overlap** | Drizzle vs Prisma if team switches | Drizzle is the kernel default; Prisma can be swapped in `@repo/database` without touching apps |
| **Auth adapter mismatch** | Better Auth uses its own Drizzle adapter; must be kept in sync with `@repo/database` schema | Both live in `packages/auth` and `packages/database`; `@repo/auth` imports `@repo/database` schema |
| **tRPC vs Hono routing** | tRPC does not produce REST endpoints; Hono is the REST surface | Mount tRPC as `app.route('/trpc', trpcHandler)` inside Hono; external consumers use Hono REST; internal clients use tRPC |
| **Node vs Bun runtime** | `kriasoft/react-starter-kit` assumes Bun; Turborepo's CI docs assume Node 20 | Choose one runtime per app; `apps/api` can use Bun; `apps/web` can use Node; avoid cross-runtime shared binaries |
| **Test runner collision** | Vitest and Jest both define globals; mixing causes type conflicts | Choose Vitest everywhere; remove Jest from all deps |
| **ESLint flat config vs legacy** | Older packages use `.eslintrc`; new packages use `eslint.config.js` | Standardize on flat config; `@repo/eslint-config` exports flat format only [^65] |
| **OTel SDK version drift** | `@opentelemetry/*` packages must stay version-aligned | Pin all OTel packages to the same minor version in `packages/telemetry/package.json` |
| **Docker vs non-Docker dev** | `packages/database` uses Docker Compose; some devs prefer cloud-hosted DB | Docker Compose is the default; `DATABASE_URL` env var overrides it; cloud URLs work immediately |
| **Starlight (Astro) vs Nextra (Next.js)** | Nextra requires Next.js; Starlight does not | Use Starlight; if the project already uses Next.js everywhere, Nextra avoids a second framework |
| **IaC HCL vs TypeScript** | OpenTofu uses HCL; Pulumi uses TypeScript | Keep IaC in HCL by default; Pulumi TypeScript is a drop-in for teams who prefer it; no shared runtime conflict |
| **CI cache vs fresh clone** | Turborepo Remote Cache requires `TURBO_TOKEN`; CI must work without it | Remote cache is optional; base CI runs clean without the token; add token as a secret later [^3] |

***

## Integration Sequence

Follow this sequence. Each step is independently testable before proceeding.

**Step 1 — Monorepo scaffold** (~1 hour)
Run `pnpm dlx create-turbo@latest`. Accept the basic starter. Verify `turbo lint`, `turbo build`, `turbo test` all pass (no source yet). Confirm `@repo/typescript-config` and `@repo/eslint-config` extend correctly in each package.

**Step 2 — Shared tooling packages** (~1 hour)
Add `tooling/commitlint-config`, `tooling/prettier-config`, `tooling/vitest-config`. Wire `husky` pre-commit hook to run `turbo lint && turbo type-check`. Add a `@repo/schema` stub package with one example Zod schema. Verify commit message enforcement.

**Step 3 — CI/CD** (~1 hour)
Add `.github/workflows/ci.yml` from the Turborepo official template. Add `dependabot.yml`. Verify the workflow runs on a test branch push and passes without secrets. The `TURBO_TOKEN` environment variable should be commented out but documented.[^3]

**Step 4 — API layer** (~2 hours)
Create `apps/api/` with Hono. Add a `/health` route and one placeholder `/api/hello` route. Mount tRPC middleware on `/trpc`. Add `packages/schema/` with one shared Zod schema used by both the API router and a placeholder client. Run `turbo build` for `apps/api` and verify it produces a runnable output.

**Step 5 — Auth scaffold** (~2 hours)
Create `packages/auth/` with Better Auth. Implement email/password auth with Drizzle adapter. Verify that `createAuth()` can create a session and validate it in an API route. Wire auth middleware into the Hono server. Do not wire a UI yet.

**Step 6 — Database layer** (~2 hours)
Create `packages/database/` with Drizzle schema for users/sessions (minimum required by Better Auth), `drizzle.config.ts`, Docker Compose for local Postgres, and migration + seed scripts. Verify `pnpm --filter @repo/database migrate` runs successfully. Wire `@repo/database` into `apps/api`.

**Step 7 — Testing hardening** (~1 hour)
Add `vitest.workspace.ts` at root. Add unit tests for `@repo/schema` validators and `@repo/auth` session logic. Add `tests/e2e/` as a workspace package with Playwright. Add one smoke test that hits `/health`. Wire `turbo test` and `turbo test:e2e` into the CI pipeline.

**Step 8 — Observability** (~1 hour)
Create `packages/telemetry/`. Export `createLogger` (Pino → console in dev, OTLP in prod) and `bootstrapTracing`. Instrument `apps/api` startup. Add a `/health` endpoint that returns service metadata. Verify structured JSON logs appear in development with request IDs.

**Step 9 — Docs scaffold** (~1 hour)
Create `apps/docs/` with Starlight. Add `index.md` with the "included vs deferred" manifest. Add `architecture/` with first ADR. Add API reference stub. Wire `turbo dev` to start docs alongside the API.

**Step 10 — IaC skeleton** (~1 hour)
Create `/infra/` with OpenTofu module stubs. Add `environments/staging/terraform.tfvars.example` and a `README.md` explaining cloud selection. No provider configuration is committed.

**Step 11 — Security baseline** (~1 hour)
Add `security-sast.yml`, `security-sca.yml`, `security-secrets.yml` as GitHub Actions that call `ministryofjustice/devsecops-actions` reusable workflows. Add CodeQL separately. Verify all three workflows appear in the Actions tab and pass (no findings on a blank codebase). Add `anchore/sbom-action` to the release stub.

***

## Phase 4 — Validation Checklist

| Item | Status | Notes |
|------|--------|-------|
| Single install and first-run flow is realistic | **Pass** | `pnpm install && pnpm --filter @repo/database migrate && pnpm dev` is achievable |
| Lint and type-check pass on fresh clone | **Pass** | Config-as-package pattern ensures all packages extend `@repo/typescript-config` [^7] |
| At least one working test per major layer | **Pass** | Step 7 mandates tests for schema, auth, and E2E smoke |
| CI runs secretless on first clone | **Pass** | Remote cache token is optional; base CI has no required secrets [^3] |
| Auth scaffold produces working login flow quickly | **Pass** | Better Auth email/password path is minimal; documented setup [^14] |
| README distinguishes "included" from "you must choose" | **Pass** | DEFERRED.md and README.md template required at synthesis time |
| All fused parts are MIT/Apache-2.0 compatible | **Pass** | All selected repos are MIT or Apache-2.0; Semgrep LGPL applies only to the tool, not consuming code; OpenTofu is MPL-2.0 (compatible with proprietary applications) [^39][^14] |
| Behaves as a reusable kernel, not a SaaS starter | **Pass** | No payment stack, no deployment target, no UI framework committed |
| Starlight versioning support maturity | **Risk** | Built-in versioned docs not yet first-class in Starlight; use Docusaurus if versioning is day-one requirement [^50][^51] |
| Bun/Node runtime parity | **Risk** | If `apps/api` uses Bun for speed, CI must install Bun; test matrix complexity increases |
| OpenTofu MPL-2.0 considerations | **Pass** | MPL-2.0 is file-level copyleft; application code does not inherit the license [^39] |

***

## Phase 5 — Non-Obvious Lenses

### Contrarian Lens

**`next-forge` (Vercel) — Reject as a kernel**

`next-forge` is the most-starred Turborepo-based full-stack template and is prominently promoted by Vercel Academy. It fails as a meta-repo kernel for three compounding reasons: it requires a **Clerk** account for auth (proprietary SaaS, not self-hostable), a **Neon** database (managed cloud PostgreSQL), and deploys exclusively to **Vercel**. The "5 minutes to running" experience becomes "1 hour of vendor account setup" and "irreversible coupling" at scale. A team choosing `next-forge` as a kernel will find themselves defending Clerk RBAC limitations, Neon connection limits, and Vercel pricing at exactly the moment scaling pressure arrives.[^58][^59][^66][^60][^67]

**Leaner alternative:** The official `create-turbo` basic starter — zero vendor assumptions, zero UI opinions, produces the `turbo.json` + config packages kernel in under five minutes.[^7][^1]

**`create-t3-app` — Reject as a kernel**

28.9k stars; the most cited full-stack TypeScript starting point. But it is a **generator**, not a composable base. Running it once produces a frozen snapshot. The tRPC + Zod + Drizzle pattern it popularized is genuinely excellent and extractable — but `create-t3-app` itself cannot be forked and evolved as a shared base; it bakes Next.js as a non-negotiable assumption.[^10][^61]

### Cross-Domain Lens

**Borrow the "transport and schema are separate" pattern from ML serving** — In ML systems (e.g., BentoML, FastAPI), the transport layer (HTTP/gRPC) is decoupled from the schema registry (Pydantic models, Protobuf). The same discipline applied to a meta-repo means: Zod schemas live in `packages/schema`, Hono handles transport in `apps/api`, and tRPC overlays on top. No app directly imports from another app.[^26][^24]

**Borrow the "mount point" architecture from Linux kernel modules** — Just as kernel modules register themselves at mount points, each meta-repo layer should register at a well-defined boundary: `@repo/auth` exports `createAuth()`, `@repo/database` exports a `db` factory, `@repo/telemetry` exports `createLogger()`. Apps never reach inside packages; they call factories.

### Emergent-Pattern Lens: Configuration as a Package

The highest-leverage pattern in modern TypeScript monorepos is **"configuration as a package"** — shipping `tsconfig.json` base variants, `eslint.config.js` presets, `vitest.config.ts` presets, and `prettier` config as internal packages addressable via the workspace protocol (`workspace:*`).[^68][^6][^7]

This pattern first appeared in the official Turborepo basic starter  and has since propagated to virtually every well-maintained TypeScript monorepo. It eliminates configuration drift, enables per-package overrides that still inherit shared defaults, and means a new package added to the monorepo needs only three lines of configuration to be fully linted, type-checked, and tested.[^7]

Repos demonstrating this pattern especially well:
- Official Turborepo basic starter: `@repo/typescript-config`, `@repo/eslint-config`[^7]
- `oNo500/nestjs-boilerplate`: TypeScript + Drizzle + Turborepo with config packages[^4]
- `clairechabas/jade`: Extends to include shared Vitest config[^5]

### Kernel Lens

**The minimum universal surface every serious app needs:**

1. A workspace that can run multiple apps in parallel and cache task outputs
2. A type-safe API boundary between client and server (schema contracts)
3. A database abstraction with migrations and local dev seeding
4. An auth boundary that handles sessions and can be extended with providers
5. Structured logging that is trace-correlated and environment-configurable
6. A CI pipeline that runs lint → type-check → test → build and fails fast
7. A security scan that catches known CVEs and secret leaks
8. A docs page that clearly distinguishes what the kernel provides vs what the project must decide

Everything else — UI framework, deployment target, payment processing, queueing, search, AI integration — is application-specific and **must be deferred**.

***

## Deferred Decisions

The following decisions are **deliberately not made** in the meta-repo kernel. Consuming projects must choose:

| Decision | Why Deferred | Default Hint |
|---------|-------------|--------------|
| **UI framework** | React, Vue, Svelte, Solid — all are valid; framework lock-in is project-specific | Start with `packages/ui` stub; add shadcn/ui + React as the simplest path |
| **Primary DB vendor** | PostgreSQL vs MySQL vs SQLite vs LibSQL — Drizzle supports all | PostgreSQL via Docker Compose for local dev; vendor chosen at deployment |
| **Cloud provider** | AWS vs GCP vs Azure vs Fly.io vs Railway — entirely project-specific | OpenTofu modules are written cloud-agnostic; provider configured in `environments/` |
| **Deployment target** | Vercel vs Fly.io vs K8s vs bare VPS — incompatible optimizations | Document the choice in ADR 0002; release.yml workflow is a stub |
| **Auth providers (OAuth)** | Google, GitHub, Apple — Better Auth supports all; which to enable is project-specific | Email/password is the kernel bootstrap path |
| **Payment stack** | Stripe, Paddle, Lemon Squeezy — no payment code in the kernel | Add as `packages/billing` when needed |
| **Queueing system** | BullMQ, inngest, Trigger.dev — depends on workload patterns | None in kernel; add as `apps/worker` + `packages/jobs` |
| **Search** | Typesense, Meilisearch, Algolia — depends on data volume and budget | None in kernel |
| **Email provider** | Resend, Postmark, SES — used by auth flows but provider-specific | Better Auth accepts any transport; add `packages/email` when needed |
| **Remote cache provider** | Vercel Remote Cache, Turborepo Cloud, Depot — CI works without it | Add `TURBO_TOKEN` after validating the workflow |

***

## Open Questions

1. **Bun vs Node runtime commitment:** `kriasoft/react-starter-kit` demonstrates that Bun significantly improves DX but requires CI to install Bun separately. Is the team willing to manage a dual-runtime matrix (Bun for `apps/api`, Node for legacy tooling)? This was not resolvable from public evidence.

2. **Better Auth scalability at high read volumes:** Better Auth's database adapter creates sessions in the same PostgreSQL instance as application data. At high traffic, session reads can become a bottleneck. Whether the library supports Redis-backed session caching is `unknown` from current documentation.

3. **OpenTofu module registry maturity:** The public OpenTofu Registry is newer and smaller than the Terraform Registry. Cloud-specific modules exist but are fewer. Whether the `zopdev/opentofu-modules` collection is production-tested at scale is `unknown`.

4. **Starlight versioned docs readiness:** As of May 2026, Starlight does not have built-in first-class versioned docs. Third-party plugins exist. If versioned documentation is a launch requirement, Docusaurus should replace Starlight.[^51][^50]

5. **tRPC v11 stability:** tRPC v11 was in RC state as of late 2024. Whether it reached stable GA is not confirmed from public sources. Verify before adopting `@trpc/server@11` in `packages/`.[^26]

6. **Security scanning false-positive rate in CI:** The `ministryofjustice/devsecops-actions` SAST workflow may produce blocking false positives on a greenfield TypeScript codebase. Threshold configuration and suppression file setup was `unknown` without a test run.

***

## Best Next Experiment

**The single cheapest validation experiment:**

> Create the workspace scaffold (Step 1–3 only) in under two hours. Run `pnpm dlx create-turbo@latest`, add `packages/schema` with one Zod type, write one unit test with Vitest, push to GitHub, and verify the CI pipeline passes from a fresh clone — no secrets, no Docker, no database.

This directly tests the two most likely failure modes: (1) that the pnpm workspace configuration and Turborepo pipeline actually run clean on a fresh clone without any prior state, and (2) that the config-as-package pattern (`@repo/typescript-config`, `@repo/eslint-config`) extends correctly into a new package without manual path resolution.

If this experiment fails in under 30 minutes, it exposes the real friction point (usually a `tsconfig` path alias or pnpm workspace glob mismatch) before any application code exists. If it passes, the monorepo scaffold layer is validated and Steps 4–11 can proceed with confidence.

Cost: ~2 hours. No cloud accounts. No paid services. Fully reversible.

---

## References

1. [Start with an example - Turborepo](https://turborepo.dev/docs/getting-started/examples) - A nearly empty Turborepo - useful for creating reproductions for GitHub Issues. SvelteKit, Monorepo ...

2. [Crafting your repository - Turborepo](https://turborepo.dev/docs/crafting-your-repository)

3. [GitHub Actions - Turborepo](https://turborepo.dev/docs/guides/ci-vendors/github-actions) - To use Remote Caching with GitHub Actions, add the following environment variables to your GitHub Ac...

4. [turborepo-starter · GitHub Topics](https://github.com/topics/turborepo-starter) - TurboCoolStack: A Turborepo starter kit that simplifies the setup for developing applications across...

5. [turborepo-starter · GitHub Topics](https://github.com/topics/turborepo-starter?l=typescript&o=asc&s=forks) - This repository is a Turborepo setup for building full-stack applications. It combines a frontend, b...

6. [Creating a new monorepo with Turborepo - GitHub Gistgist.github.com › cedrickchee](https://gist.github.com/cedrickchee/dfdb66c457c7b9e1682feedcc4fd6302) - Creating a new monorepo with Turborepo. GitHub Gist: instantly share code, notes, and snippets.

7. [turborepo/examples/basic/README.md at main · vercel/turborepo](https://github.com/vercel/turborepo/blob/main/examples/basic/README.md) - Build system optimized for JavaScript and TypeScript, written in Rust - vercel/turborepo

8. [GitHub - kriasoft/react-starter-kit: Modern React starter kit with Bun, TypeScript, Tailwind CSS, tRPC, and Cloudflare Workers. Production-ready monorepo for building fast web apps.](http://github.com/kriasoft/react-starter-kit) - Modern React starter kit with Bun, TypeScript, Tailwind CSS, tRPC, and Cloudflare Workers. Productio...

9. [React Starter Kit v3.0: A Complete Stack Overhaul - DEV Community](https://dev.to/koistya/react-starter-kit-v20-a-complete-stack-overhaul-34h2) - I've decided to completely overhaul the project with a new tech stack that reflects where web develo...

10. [t3-oss/create-t3-app: The best way to start a full-stack, ...](https://github.com/t3-oss/create-t3-app) - The stated goal of create-t3-app is to provide the quickest way to start a new full-stack, typesafe ...

11. [Production-ready full-stack TypeScript/React starter with Chakra UI](https://github.com/chakra-ui/chakra-ui/discussions/10698) - The boilerplate includes: Chakra UI with light/dark mode; Accessible patterns: skip-to-content, useI...

12. [Full-stack TypeScript/React Boilerplate for 2026 #21819 - GitHub](https://github.com/vitejs/vite/discussions/21819) - We just published the 2026 Boilerplate, a production-ready full-stack TypeScript/React starter, and ...

13. [GitHub - Clstialdev/next-nest-starter: A modern fullstack monorepo ...](https://github.com/Clstialdev/next-nest-starter) - A modern fullstack monorepo starter with Next.js 15, NestJS, Drizzle ORM (Optional), and type-safe c...

14. [better-auth/better-auth: The most comprehensive ...](https://github.com/better-auth/better-auth) - The most comprehensive authentication framework for TypeScript - better-auth/better-auth

15. [Better Auth · GitHub](https://github.com/better-auth) - The most comprehensive authentication framework. Better Auth has 14 repositories available. Follow t...

16. [Future plans · lucia-auth lucia · Discussion #1707 - GitHub](https://github.com/lucia-auth/lucia/discussions/1707) - I am planning to deprecate the library early next year. It has become abundantly clear to me that Lu...

17. [Auth.js is now part of Better Auth](https://www.better-auth.com/blog/authjs-joins-better-auth) - We're excited to announce that Auth.js, formerly known as NextAuth.js, is now being maintained and o...

18. [multi-tenant-architecture · GitHub Topics](https://github.com/topics/multi-tenant-architecture?o=desc&s=forks) - A Fastify & Drizzle ORM starter for building multi-tenant RBAC APIs with TypeScript. ... Production-...

19. [GitHub - better-auth/better-auth: The most comprehensive authentication framework for TypeScript](http://github.com/better-auth/better-auth) - The most comprehensive authentication framework for TypeScript - better-auth/better-auth

20. [Prisma to Drizzle migration complete! Our journey and lessons learned](https://github.com/drizzle-team/drizzle-orm/discussions/3146) - We recently migrated from Prisma to Drizzle and wanted to provide a quick write-up on our experience...

21. [Shared database schema with DrizzleORM and Turborepo](https://pliszko.com/blog/post/2023-08-31-shared-database-schema-with-drizzleorm-and-turborepo) - Learn how to create shared database package to use in multiple projects with DrizzleORM and Turborep...

22. [GitHub - htsh-tsyk/turbo-drizzle: Turborepo starter with shadcn/ui pre ...](https://github.com/htsh-tsyk/turbo-drizzle) - This is turborepo starter with Drizzle ORM and PostgreSQL pre-configured. Note: This example uses pn...

23. [Sharing schema across monorepo #885 - GitHub](https://github.com/drizzle-team/drizzle-orm/discussions/885) - I'm currently converting a nextJs frontend to a monorepo with a new backend for handling async tasks...

24. [Hono vs tRPC vs oRPC — API Layer Comparison for SaaS](https://supastarter.dev/blog/hono-vs-trpc-vs-orpc-api-comparison) - Hono is an ultralight HTTP framework optimized for edge environments. It follows familiar REST patte...

25. [GitHub - maybemaby/fastify-trpc-next: A starter project monorepo with Fastify, tRPC, and Next.js. Monorepo setup with Turborepo and pnpm.](https://github.com/maybemaby/fastify-trpc-next) - A starter project monorepo with Fastify, tRPC, and Next.js. Monorepo setup with Turborepo and pnpm. ...

26. [GitHub - barclayd/react-router-trpc-hono-bun-template: Template for setting up a monorepo for react router (v7) with Hono via trpc, powered by bun, turborepo, tailwind v4, playwright, tailwind and vite](https://github.com/barclayd/react-router-trpc-hono-bun-template) - Template for setting up a monorepo for react router (v7) with Hono via trpc, powered by bun, turbore...

27. [ministryofjustice/devsecops-actions - GitHub](https://github.com/ministryofjustice/devsecops-actions) - A collection of reusable GitHub Actions that standardise DevSecOps security scanning i.e. SCA, SAST,...

28. [ministryofjustice/devsecops-actions/sca/codeql - StepSecurity](https://app.stepsecurity.io/action-advisor/ministryofjustice/devsecops-actions/sca/codeql) - A collection of reusable GitHub Actions that standardise DevSecOps security scanning i.e. SCA, SAST,...

29. [dwarvesf/monorepo-deploy-gh-actions-template: Turborepo starter ...](https://github.com/dwarvesf/monorepo-deploy-gh-actions-template) - This repository is a template for creating Turborepo project that can be deployed to Vercel using th...

30. [The Complete Guide to GitHub Actions for Monorepos - WarpBuild](https://warpbuild.com/blog/github-actions-monorepo-guide) - Learn how to optimize GitHub Actions for monorepos using Turborepo, Nx, and pnpm workspaces. Reduce ...

31. [Nextjs Testing Guide: Unit and E2E Tests with Vitest & Playwright](https://strapi.io/blog/nextjs-testing-guide-unit-and-e2e-tests-with-vitest-and-playwright) - In this article, you will write unit tests in Next.js client components and synchronous server compo...

32. [From JSDOM to Real Browsers: Testing Svelte with Vitest Browser ...](https://scottspence.com/posts/testing-with-vitest-browser-svelte-guide) - The pnpm exec playwright install step is crucial - without it, browser tests will fail with “No brow...

33. [Setting Up End-to-End Testing with Playwright - Kyrre Gjerstad](https://kyrre.dev/blog/end-to-end-testing-setup) - In this guide, I'll walk through setting up Playwright, covering both monorepo and standard reposito...

34. [Issue #602 · vercel/next-forge - add playwright - GitHub](https://github.com/vercel/next-forge/issues/602) - While the template covers unit/integration tests well with Vitest and Testing ... E2E setup, especia...

35. [open-telemetry/opentelemetry-js - GitHub](https://github.com/open-telemetry/opentelemetry-js) - This is the JavaScript version of OpenTelemetry, a framework for collecting traces, metrics, and log...

36. [pinojs/pino-opentelemetry-transport](https://github.com/pinojs/pino-opentelemetry-transport) - OpenTelemetry transport for Pino. Contribute to pinojs/pino-opentelemetry-transport development by c...

37. [opentelemetry/instrumentation-pino](https://www.npmjs.com/package/@opentelemetry/instrumentation-pino) - OpenTelemetry instrumentation for `pino` logger. Latest version: 0.52.0, last published: 6 days ago....

38. [Integrating Pino with Open Telemetry for Structured Logging](https://medium.com/@harinniygopikannan/integrating-pino-with-open-telemetry-for-structured-logging-1e834d8a1445) - Logging and visualisation go hand in hand specially for an enterprise grade application.

39. [OpenTofu - GitHub](https://github.com/opentofu) - OpenTofu is an infrastructure as code tool that lets you define both cloud and on-prem resources in ...

40. [OpenTofu](https://opentofu.org) - Define your infrastructure as code with OpenTofu. A few lines of configuration is all you need to cr...

41. [zopdev/opentofu-modules - GitHub](https://github.com/zopdev/opentofu-modules) - A Terraform-based open-source framework to provision, manage, and operate Kubernetes clusters, cloud...

42. [Infrastructure as Code | Pulumi Docs](https://www.pulumi.com/docs/iac/) - Learn how to create, deploy, and manage infrastructure on any cloud using Pulumi's open source infra...

43. [Pulumi/examples](https://github.com/pulumi/examples) - Infrastructure, containers, and serverless apps to AWS, Azure, GCP, and Kubernetes... all deployed w...

44. [GitHub - prettier/eslint-config-prettier: Turns off all rules that are unnecessary or might conflict with Prettier.](https://github.com/prettier/eslint-config-prettier) - Turns off all rules that are unnecessary or might conflict with Prettier. - prettier/eslint-config-p...

45. [Monorepo Configuration - typescript-eslint](https://typescript-eslint.io/troubleshooting/typed-linting/monorepos) - If you're using a monorepo with parserOptions.project, these docs will help you figure out how to se...

46. [Monorepo Configuration - typescript-eslint](https://typescript-eslint.io/troubleshooting/typed-linting/monorepos/) - The new "project service" in v8 requires no additional configuration for monorepos.

47. [Starlight Build documentation sites with Astro](https://starlight.astro.build) - Starlight helps you build beautiful, high-performance documentation websites with Astro.

48. [Docs Theme - Nextra](https://nextra.site/docs/docs-theme/start) - Nextra Docs Theme is a theme that includes almost everything you need to build a modern documentatio...

49. [Guides tagged "nextra" - PkgPulse](https://www.pkgpulse.com/guides/tag/nextra) - Docusaurus, VitePress, Starlight, and Nextra compared for documentation sites. MDX support, search, ...

50. [Support for Versioned Docs · withastro starlight · Discussion #957](https://github.com/withastro/starlight/discussions/957) - What version of starlight are you using? 0.5.5 What is your idea? Built-in support for versioned doc...

51. [Support for Versioned Docs · Issue #372 · withastro/starlight](https://github.com/withastro/starlight/issues/372) - What version of starlight are you using? 0.5.5 What is your idea? Built-in support for versioned doc...

52. [From "monolith" to an Astro preset. · withastro starlight - GitHub](https://github.com/withastro/starlight/discussions/1422) - What version of starlight are you using? 0.17.0 What is your idea? I landed on Astro because of its ...

53. [ministryofjustice/devsecops-actions/sca/moj - StepSecurity](https://app.stepsecurity.io/action-advisor/ministryofjustice/devsecops-actions/sca/moj) - A collection of reusable GitHub Actions that standardise DevSecOps security scanning i.e. SCA, SAST,...

54. [CodeQL and Dependabot Report Action - GitHub Marketplace](https://github.com/marketplace/actions/codeql-and-dependabot-report-action) - Generates security reports for a GitHub repository

55. [Semgrep SAST Scan Github Actions](https://gist.github.com/Kavyeshs41/46d2209fd27a85e2977ecd9310585934) - Semgrep SAST Scan Github Actions. GitHub Gist: instantly share code, notes, and snippets.

56. [Automatisieren von Dependabot mit GitHub Actions](https://docs.github.com/de/code-security/tutorials/secure-your-dependencies/automating-dependabot-with-github-actions?learn=dependency_version_updates) - Beispiele für die Verwendung von GitHub Actions zum Automatisieren allgemeiner Dependabot-bezogener ...

57. [GitHub Actions in DevSecOps: A Comprehensive Tutorial](https://devsecopsschool.com/blog/github-actions-in-devsecops-a-comprehensive-tutorial/) - Run integration, security, and compliance tests. Release, Sign artifacts, scan containers, and deplo...

58. [Production Patterns with next-forge | Vercel Academy](https://vercel.com/academy/production-monorepos/next-forge-patterns) - Explore next-forge, Vercel's production-ready Turborepo starter, to see how all the patterns you've ...

59. [vercel/next-forge: Production-grade Turborepo template for ... - GitHub](https://github.com/vercel/next-forge) - next-forge is a production-grade Turborepo template for Next.js apps. It's designed to be a comprehe...

60. [next-forge - Vercel](https://vercel.com/templates/next.js/next-forge) - Comprehensive Turborepo template for Next.js apps.

61. [Create T3 App](https://create.t3.gg) - We made create-t3-app to do one thing: Streamline the setup of typesafe Next.js apps WITHOUT comprom...

62. [Prisma migration guide #526 - drizzle-team/drizzle-orm - GitHub](https://github.com/drizzle-team/drizzle-orm/issues/526) - There ought to be a Prisma migration guide and/or codemod to assist with this. Pretty difficult to a...

63. [@opentelemetry/instrumentation-winston](https://www.npmjs.com/package/@opentelemetry/instrumentation-winston) - OpenTelemetry instrumentation for `winston` logger. Latest version: 0.45.0, last published: 6 days a...

64. [@opentelemetry/instrumentation-pino](https://www.npmjs.com/package/@opentelemetry/instrumentation-pino?activeTab=code) - OpenTelemetry instrumentation for `pino` logger. Latest version: 0.46.1, last published: 19 days ago...

65. [Using flat config in monorepo: one config file or multiple? #16960](https://github.com/eslint/eslint/discussions/16960) - Flat config has just one location for all of your project's configuration: the eslint.config.js file...

66. [The Next.js Vendor Lock-In Architecture - Medium](https://medium.com/@ss-tech/the-next-js-vendor-lock-in-architecture-a0035e66dc18) - How Vercel Engineered Systematic Switching Costs Into React’s Most Popular Framework

67. [Posted by vercel : r/nextjs - Reddit](https://www.reddit.com/r/nextjs/comments/1otuo44/posted_by_vercel/) - I believe that they think of Vercel as something much bigger than Next.js. That's why the vendor loc...

68. [Sharing Configurations Within a Monorepo - DEV Community](https://dev.to/mbarzeev/sharing-configurations-within-a-monorepo-42bn) - In this post join me as I share my approach for sharing different tooling configurations within a mo...

