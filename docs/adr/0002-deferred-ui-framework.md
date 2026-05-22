# ADR 0002: Defer UI Framework Selection

## Status

Accepted

## Context

The kernel is intended to be forked by multiple consuming projects. Choosing a frontend framework now would leak product assumptions into the reusable base layer and force downstream repos to unwind directory layout, shared dependencies, lint rules, build tooling, and deployment expectations that may not match their actual product needs.

## Decision

Do not ship a UI application or framework-specific component stack in the kernel. Keep the docs app as documentation-only infrastructure and leave the product-facing UI choice to consuming projects, which should record that decision in a follow-up ADR before introducing a framework such as React, Vue, Svelte, Solid, or a framework-specific meta-toolchain.

## Consequences

- The kernel stays vendor-neutral for teams that only need an API, docs, worker processes, or a different frontend stack.
- Shared tooling remains focused on TypeScript, testing, formatting, and CI rather than framework-specific build assumptions.
- A consuming project must make an explicit UI choice later instead of inheriting one accidentally from the kernel.
