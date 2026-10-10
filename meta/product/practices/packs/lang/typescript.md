---
id: lang/typescript
title: TypeScript
researched: 2026-10-10
tier: standard
sources:
  - https://www.typescriptlang.org/tsconfig/strict.html
  - https://www.typescriptlang.org/tsconfig/noEmit.html
  - https://www.typescriptlang.org/tsconfig/isolatedModules.html
  - https://www.typescriptlang.org/tsconfig/moduleResolution.html
  - https://www.typescriptlang.org/tsconfig/noUncheckedIndexedAccess.html
  - https://www.typescriptlang.org/tsconfig/verbatimModuleSyntax.html
  - https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/
  - https://www.typescriptlang.org/docs/handbook/2/narrowing.html
  - https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
  - https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html
  - https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html
  - https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html
  - https://typescript-eslint.io/users/configs/
  - https://typescript-eslint.io/getting-started/
  - https://typescript-eslint.io/getting-started/typed-linting/
  - https://typescript-eslint.io/rules/no-explicit-any/
  - https://typescript-eslint.io/rules/no-non-null-assertion/
  - https://typescript-eslint.io/rules/consistent-type-imports/
  - https://typescript-eslint.io/rules/ban-ts-comment/
  - https://typescript-eslint.io/rules/no-unused-vars/
  - https://eslint.org/docs/latest/use/configure/configuration-files
  - https://vite.dev/guide/features.html
  - https://vitest.dev/guide/cli.html
  - https://vitest.dev/guide/testing-types
  - https://github.com/sverweij/dependency-cruiser
  - https://knip.dev/overview/getting-started
  - https://github.com/kucherenko/jscpd
  - https://prettier.io/docs/cli
  - https://nodejs.org/en/about/previous-releases
---

| ID | Level | Rule | Enforce | Source |
|---|---|---|---|---|
| TS-001 | MUST | Keep `"strict": true` in tsconfig.json. | check-cmd: grep -q '"strict": true' tsconfig.json | https://www.typescriptlang.org/tsconfig/strict.html |
| TS-002 | MUST | Keep `"noEmit": true` in tsconfig.json so tsc only type-checks and Vite emits the bundle. | check-cmd: grep -q '"noEmit": true' tsconfig.json | https://www.typescriptlang.org/tsconfig/noEmit.html |
| TS-003 | MUST | Keep `"isolatedModules": true` in tsconfig.json so each file transpiles on its own under Vite. | check-cmd: grep -q '"isolatedModules": true' tsconfig.json | https://www.typescriptlang.org/tsconfig/isolatedModules.html |
| TS-004 | MUST | Set `"moduleResolution": "bundler"` in tsconfig.json. | check-cmd: grep -q '"moduleResolution": "bundler"' tsconfig.json | https://www.typescriptlang.org/tsconfig/moduleResolution.html |
| TS-005 | SHOULD | Mark type-only imports with `import type` or an inline `type` modifier. | lint: @typescript-eslint/consistent-type-imports (not in recommended; enable explicitly) | https://typescript-eslint.io/rules/consistent-type-imports/ |
| TS-006 | MUST | Re-export a type with `export type`, never with a plain `export`. | check-cmd: npx tsc --noEmit | https://www.typescriptlang.org/tsconfig/isolatedModules.html |
| TS-007 | MUST | Do not write `any`; type unknown values as `unknown` and narrow them before use. | lint: @typescript-eslint/no-explicit-any | https://typescript-eslint.io/rules/no-explicit-any/ |
| TS-008 | MUST | Narrow a caught value with `instanceof` or a type guard before reading its `message`. | check-cmd: npx tsc --noEmit | https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html |
| TS-009 | MUST | Give every `@ts-expect-error` a written reason and never use `@ts-ignore`. | lint: @typescript-eslint/ban-ts-comment | https://typescript-eslint.io/rules/ban-ts-comment/ |
| TS-010 | SHOULD | Avoid the non-null assertion operator `!`; narrow the value with a check instead. | lint: @typescript-eslint/no-non-null-assertion (not in recommended; enable explicitly) | https://typescript-eslint.io/rules/no-non-null-assertion/ |
| TS-011 | MUST | Switch over every member of a discriminated union, with a default that assigns the leftover value to a `never`-typed constant. | check-cmd: npx tsc --noEmit | https://www.typescriptlang.org/docs/handbook/2/narrowing.html |
| TS-012 | MUST | Remove unused variables, imports and parameters instead of leaving them in committed code. | lint: @typescript-eslint/no-unused-vars | https://typescript-eslint.io/rules/no-unused-vars/ |
| TS-013 | SHOULD | Set `"noUncheckedIndexedAccess": true` in tsconfig.json and handle `undefined` on reads from index signatures and records. | check-cmd: grep -q '"noUncheckedIndexedAccess": true' tsconfig.json | https://www.typescriptlang.org/tsconfig/noUncheckedIndexedAccess.html |
| TS-014 | SHOULD | Keep ESLint on typescript-eslint's non-type-checked presets; eslint.config.js must not reference any TypeChecked preset. | check-cmd: ! grep -q TypeChecked eslint.config.js | https://typescript-eslint.io/getting-started/typed-linting/ |
| TS-015 | SHOULD | Use `satisfies` to check an object literal against a type while keeping its specific inferred types. | review | https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html |
| TS-016 | MUST | Keep test files inside the tsconfig include so `npx tsc --noEmit` type-checks them, because Vitest type-checks only in typecheck mode. | check-cmd: npx tsc --noEmit | https://vitest.dev/guide/testing-types |
| TS-017 | SHOULD | Assert the types of public contracts with `expectTypeOf` in Vitest test files. | test | https://vitest.dev/guide/testing-types |
| TS-018 | MUST | Put `tsc --noEmit` in the build script before `vite build`, because Vite only transpiles. | review | https://vite.dev/guide/features.html |
| TS-019 | MUST | Run tests with `vitest run` in CI and check scripts, never bare `vitest` watch mode. | review | https://vitest.dev/guide/cli.html |
| TS-020 | MUST | Run `prettier --check` in the check script and fail on unformatted files. | check-cmd: grep -q "prettier --check" scripts/check.sh | https://prettier.io/docs/cli |
| TS-021 | MUST | Declare import boundaries as dependency-cruiser forbidden rules and fail the check on any violation. | check-cmd: npm run boundaries | https://github.com/sverweij/dependency-cruiser |
| TS-022 | MUST | Remove unused files, exports and dependencies that knip reports. | check-cmd: npx knip | https://knip.dev/overview/getting-started |
| TS-023 | SHOULD | Measure copy-paste duplication in src with jscpd and fail the check above the threshold set in package.json. | check-cmd: npm run duplication | https://github.com/kucherenko/jscpd |
| TS-024 | MUST | Run the toolchain on Node.js 24 or later, the LTS line the stack ratifies (24.21.0). | check-cmd: node -e "process.exit(Number(process.versions.node.split('.')[0])>=24?0:1)" | https://nodejs.org/en/about/previous-releases |
| TS-025 | MUST | Do not set `ignoreDeprecations` in tsconfig.json; fix deprecated options so the project survives TypeScript 7. | check-cmd: ! grep -q ignoreDeprecations tsconfig.json | https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/ |
| TS-026 | SHOULD | List the ambient types the code needs in tsconfig `types`, because TypeScript 6.0 defaults `types` to an empty array. | review | https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/ |
