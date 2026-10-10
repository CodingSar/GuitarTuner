# Stack

Status: set by init-factory, TASK-1.

| Key | Value |
|---|---|
| language and version | TypeScript 6.0.3 |
| framework | none |
| package manager | npm |
| install command | npm ci |
| source root | src |
| source extensions | .ts |
| test file pattern | ^.*\.test\.ts$ |
| name case | kebab |
| entry file stems | index, handler |
| datastore | none |
| connection variable | none |
| migration command | none |
| test command (full) | npx vitest run |
| test command (targeted, takes a path) | npx vitest run <path> |
| check command | scripts/check.sh |
| fix command | npm run fix |
| dependencies approved | typescript, vite, vitest, eslint, @eslint/js, typescript-eslint, prettier, dependency-cruiser, jscpd, knip, @types/node |

Notes, not cells:

- Runtime: Node 24.21.0 LTS (`engines` in `package.json`). Build and dev tool: Vite 8.3.4. No UI framework; the product view uses plain TypeScript and canvas.
- Versions are exact pins in `package.json`, resolved from the npm registry at init. TypeScript stays at 6.x: `typescript-eslint` 8.71.1 declares `typescript <6.1.0`.
- Static tools: linter ESLint 10.12.0 with typescript-eslint 8.71.1 (`eslint.config.js`); formatter Prettier 3.9.10; import boundaries dependency-cruiser 18.5.0 (`.dependency-cruiser.cjs`, the `boundaries` script); duplication jscpd 5.4.1 (`duplication` script, tests excluded); dead code knip 6.41.0 (`knip.json`).
- Architecture: HD-11 default (modules of slices), default caps.
- Datastore: none. Supersedes HD-2 (`decision-6`); see `meta/product/persistence.md`.

The check command runs every static check and exits non-zero on any failure:
linter and formatter check, the import boundary checker, `structure.py`,
duplication (source files only, not tests), dead code, and practice
`check-cmd` rules. The fix command rewrites files in place with the
formatter and the linter's fix mode.

Cell values are bare: a path, a command, or a list. Notes go in this text,
not in the cells, because `packet.py` and `check.sh` read the cells.

Until the test command is set, the orchestrator stops at preflight
(`meta/core/guides/orchestrate.md`, section 0). Workers never guess a command.
