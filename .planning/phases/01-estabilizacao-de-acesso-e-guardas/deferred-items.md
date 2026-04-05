# Deferred Items - 01-01

- `bun run typecheck` does not complete in this workspace run window (process stalls at `vue-tsc -b --noEmit`).
- `bun run lint:fix` and `bun lint` fail due to local dependency issue: `Cannot find module './linter'` from ESLint package.
- `bun prettier` does not complete in the observed run window.

These are out-of-scope/infrastructure-level blockers for this plan execution and were not introduced by the login/guard changes.
