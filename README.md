# GuitarTuner

Browser guitar tuner plus a 6-string falling-note practice view with adjustable speed.

Tune each string by microphone pitch detection, then practice by playing the
right string and fret as notes fall. The speed toggles make the notes fall
faster or slower. Everything runs in the browser: no accounts, no server, and
no stored data.

## Install

```
npm ci
```

Node 24.21.0 LTS is pinned in `.nvmrc`.

## Test and check

```
npx vitest run        # full tests
scripts/check.sh      # every static check
```

## Built with the GhostInside harness

This product was set up with the GhostInside harness. See `meta/_about.md`
for how the factory works.
