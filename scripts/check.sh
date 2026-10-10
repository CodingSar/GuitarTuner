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
