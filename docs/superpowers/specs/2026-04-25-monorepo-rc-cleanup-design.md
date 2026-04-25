# Monorepo RC Cleanup Design

**Date:** 2026-04-25\
**Goal:** Make the monorepo presentable for moving to its own GitHub repo (`github.com/minho-friends/friend-design-system`).

## Scope

Six focused tasks to take the monorepo from current working state to a clean, presentable release candidate.

## 1. Fix critical exports bug

Root `package.json` has a broken subpath export path introduced during directory reorganization:

```json
// BROKEN
"./json-render": "./json-render/dist/index.js"

// CORRECT
"./json-render": "./derives/json-render/dist/index.js"
```

This must be fixed before any consumer can use `@minho-friends/friend-design-system/json-render`.

## 2. Untrack committed build artifacts

`tests/storybook-react/storybook-static/` (~60 files, several MB) is currently tracked in git despite `.gitignore` covering `storybook-static/`. The `.gitignore` was added after initial commit, so files remain tracked.

Fix: `git rm -r --cached tests/storybook-react/storybook-static/`

## 3. MIT LICENSE

Standard MIT license. Author: `minho-friends`.

## 4. CHANGELOG.md

Keep-a-Changelog format. Single `[Unreleased] → v0.1.0` entry covering:

- Rollup build for `components/lit/` with `lit` as external peer dep
- Single-package subpath exports (`./lit`, `./react`, `./json-render`)
- Scoped package names (`@minho-friends/friend-design-system--*`)
- Directory reorganization (`components/`, `derives/`, `apps/`, `test/`)

## 5. Polish README.md

Replace the current TODO-checklist README with:

- One-line description
- Install + subpath usage examples
- Accurate directory tree
- Build instructions (`nx run-many --target=build`)
- Peer dependency note (`lit`, `react`)

## 6. Verify all packages build and test clean

After the exports fix, run:

- `nx run-many --target=build`
- `nx run-many --target=test`

All must pass before the branch is considered RC.

## Out of scope

- Publishing to GitHub Packages (separate phase)
- GitHub Actions CI workflow (separate phase)
- `publishConfig` / `.npmrc` setup (separate phase)
- Versioning strategy (separate phase)
- The `/chat#demo` FIXME in `apps/demo/app/page.tsx` (separate concern)
