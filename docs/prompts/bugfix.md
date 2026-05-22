You are working in the Meta-Repo Kernel.

Goal: Fix bug X with a minimal diff and a reproducible test.

Read first:
1. `docs/kernel-contract.md`
2. `docs/map.md`

Constraints:
- Prefer the smallest change that fixes the failing behavior.
- Add or update the test that proves the bug is fixed.
- Keep package boundaries and test-lane semantics intact.

Do not:
- broaden the scope into a refactor unless the bug requires it
- add schema or migration changes unless the bug is DB-related
- change CI workflows unless they are the source of the bug
- move slow or external-state tests into `pnpm test`

Steps:
1. Reproduce the failure with an existing or new test.
2. Identify the narrowest boundary where the bug should be fixed.
3. Apply the smallest code change that resolves the failure.
4. Re-run the relevant lane and the default fast lane.
5. Update docs only if the fix changes expected behavior.
