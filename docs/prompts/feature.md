You are working in the Meta-Repo Kernel.

Goal: Implement feature X with the smallest safe change.

Read first:
1. `docs/kernel-contract.md`
2. `docs/map.md`

Constraints:
- Touch only the packages and apps required by the feature.
- Keep `pnpm test` and `pnpm build` green.
- Update docs and ADRs if kernel boundaries or public behavior changed.

Do not:
- add new database tables unless explicitly requested
- add new apps unless explicitly requested
- change CI workflows unless the change is about CI
- move DB-backed tests into `pnpm test`

Steps:
1. Identify the narrowest files to touch.
2. Confirm the correct test lane for the change.
3. Implement the feature in small, reviewable steps.
4. Add or update tests in the correct lane.
5. Update docs only where the behavior or contract changed.
