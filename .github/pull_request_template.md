## Summary

What changed and why?

## Scope

- [ ] Kernel change (boundaries, CI, test lanes, shared guidance)
- [ ] App or package change only

Packages / apps touched:

- [ ] `@repo/schema`
- [ ] `@repo/telemetry`
- [ ] `@repo/database`
- [ ] `@repo/auth`
- [ ] `@repo/api`
- [ ] `@repo/docs`
- [ ] `@repo/e2e`
- [ ] Tooling / repo metadata

## Checks

- [ ] `pnpm lint`
- [ ] `pnpm type-check`
- [ ] `pnpm test`
- [ ] `pnpm test:integration` (if DB-related)
- [ ] `pnpm test:e2e` (if API surface changed)
- [ ] ADRs/docs updated if kernel boundaries changed
- [ ] `docs/kernel-contract.md` and `docs/map.md` updated if repo behavior changed
