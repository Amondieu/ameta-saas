You are working in the Meta-Repo Kernel.

Goal: Refactor area X while preserving behavior and package boundaries.

Read first:
1. `docs/kernel-contract.md`
2. `docs/map.md`
3. `docs/decisions.md`

Constraints:
- Preserve existing public behavior unless the task explicitly changes it.
- Keep imports flowing in the current direction unless an ADR-backed boundary change is intended.
- Keep all relevant test lanes green.

Do not:
- introduce new runtime packages unless explicitly requested
- change schema ownership or auth/database direction casually
- rewrite CI workflows unless the refactor is about CI
- move DB-backed or browser-backed tests into the unit lane

Steps:
1. State the current boundary and the target boundary.
2. List the smallest set of files required for the refactor.
3. Preserve or expand tests before changing behavior-sensitive code.
4. Update docs, maps, and ADRs if the refactor changes kernel structure.
5. Validate the affected lanes plus the default fast lane.
