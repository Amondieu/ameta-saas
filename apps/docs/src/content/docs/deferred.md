---
title: Deferred Decisions
description: Decisions the kernel leaves open for each consuming project.
---

The kernel intentionally leaves these choices open so downstream projects can commit to them later without rewriting the workspace foundation.

## Product Stack

- UI framework
- Design system and component library
- Background jobs and queueing
- Search
- Billing

## Infrastructure

- Cloud provider
- Deployment target
- Database vendor
- Infrastructure as code implementation details
- Remote cache provider

## Integration Choices

- OAuth providers
- Email provider
- Session scaling strategy
- Observability backend

Record each decision with an ADR before introducing it into the repo.
