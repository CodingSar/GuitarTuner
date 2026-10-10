#!/usr/bin/env bash
# Runs every static check in order and stops at the first failure.
set -euo pipefail
cd "$(dirname "$0")/.."

npx eslint src eslint.config.js vite.config.ts vitest.config.ts
npx prettier --check src scripts eslint.config.js vite.config.ts vitest.config.ts tsconfig.json package.json .dependency-cruiser.cjs knip.json
npm run boundaries
python3 -I meta/core/tools/structure.py --root src --ext .ts --test '^.*\.test\.ts$' --case kebab --index index --handler handler
npm run duplication
npx knip

# Practice checks (meta/product/practices/enforced.md). Each line names its rule.
# `set -e` ignores a negated command (! cmd), so forbidden-pattern rules use forbid.
forbid() {
  if "$@"; then
    echo "forbidden pattern found: $*" >&2
    exit 1
  fi
}

npx tsc --noEmit                                                             # TS-006, TS-008, TS-011, TS-016
grep -q '"strict": true' tsconfig.json                                       # TS-001
grep -q '"noEmit": true' tsconfig.json                                       # TS-002
grep -q '"isolatedModules": true' tsconfig.json                              # TS-003
grep -q '"moduleResolution": "bundler"' tsconfig.json                        # TS-004
grep -q '"noUncheckedIndexedAccess": true' tsconfig.json                     # TS-013
forbid grep -q TypeChecked eslint.config.js                                  # TS-014
forbid grep -q ignoreDeprecations tsconfig.json                              # TS-025
grep -q "prettier --check" scripts/check.sh                                  # TS-020
node -e "process.exit(Number(process.versions.node.split('.')[0])>=24?0:1)"  # TS-024
test -f package-lock.json                                                    # SEC-018
grep -qx "ignore-scripts=true" .npmrc                                        # SEC-019
forbid grep -q "unsafe-" index.html                                          # SEC-002
forbid grep -rnE -e innerHTML -e outerHTML -e insertAdjacentHTML -e "document\.write" src  # SEC-012
forbid grep -rnE "uses: [^#]+@v[0-9]" .github/workflows                      # SEC-023
forbid grep -rn pull_request_target .github/workflows                        # SEC-024
test -f SECURITY.md -o -f .github/SECURITY.md                                # SEC-026
