# Monorepo RC Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the `@minho-friends/friend-design-system` monorepo presentable for moving to its own GitHub repository.

**Architecture:** Six sequential tasks: fix a critical exports path bug, remove tracked storybook build artifacts, add LICENSE and CHANGELOG, rewrite the README, then verify all packages build and test clean.

**Tech Stack:** npm workspaces, NX, TypeScript, Rollup (components/lit), Next.js (apps/demo)

**Spec:** `docs/superpowers/specs/2026-04-25-monorepo-rc-cleanup-design.md`

---

### Task 1: Fix broken `./json-render` export path

**Files:**

- Modify: `monorepo/package.json` (exports field)

- [ ] **Step 1: Fix the path**

In `monorepo/package.json`, change:

```json
"./json-render": "./json-render/dist/index.js"
```

to:

```json
"./json-render": "./derives/json-render/dist/index.js"
```

Full exports block after fix:

```json
"exports": {
  "./lit":         "./components/lit/dist/index.js",
  "./react":       "./components/react/dist/index.js",
  "./json-render": "./derives/json-render/dist/index.js"
}
```

- [ ] **Step 2: Verify the path exists (after a build)**

```bash
ls monorepo/derives/json-render/dist/index.js
```

Expected: file exists (or will exist after `nx run @minho-friends/friend-design-system--json-render:build`)

- [ ] **Step 3: Commit**

```bash
git add monorepo/package.json
git commit -m "fix: correct json-render subpath export path to derives/json-render/dist

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Untrack committed storybook-react build artifacts

**Files:**

- Untrack: `monorepo/tests/storybook-react/storybook-static/` (60+ files)

- [ ] **Step 1: Confirm which files are tracked**

```bash
git ls-files monorepo/tests/storybook-react/storybook-static/ | wc -l
```

Expected: ~60 files

- [ ] **Step 2: Remove from git index (keep local copies)**

```bash
cd /path/to/worktree  # .worktrees/pipeline
git rm -r --cached monorepo/tests/storybook-react/storybook-static/
```

Expected: a long list of `rm 'monorepo/tests/storybook-react/storybook-static/...'` lines

- [ ] **Step 3: Confirm .gitignore already covers it**

```bash
grep "storybook-static" monorepo/.gitignore
```

Expected: `storybook-static/` is present

- [ ] **Step 4: Verify git status shows only deletions (no new untracked mess)**

```bash
git status --short monorepo/tests/storybook-react/storybook-static/ | head -5
```

Expected: lines starting with `D` (deleted from index), none starting with `??`

- [ ] **Step 5: Commit**

```bash
git add monorepo/tests/storybook-react/storybook-static/
git commit -m "chore: untrack storybook-react/storybook-static build artifacts

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Add MIT LICENSE

**Files:**

- Create: `monorepo/LICENSE`

- [ ] **Step 1: Create the file**

Create `monorepo/LICENSE` with exact content:

```
MIT License

Copyright (c) 2026 minho-friends

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 2: Commit**

```bash
git add monorepo/LICENSE
git commit -m "chore: add MIT LICENSE

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Add CHANGELOG.md

**Files:**

- Create: `monorepo/CHANGELOG.md`

- [ ] **Step 1: Create the file**

Create `monorepo/CHANGELOG.md` with exact content:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-04-25

### Added

- Single-package subpath exports: `@minho-friends/friend-design-system/lit`, `/react`, `/json-render`
- Rollup production build for `components/lit` with `lit` as external peer dependency
- Layout primitives: `Stack`, `Grid`, `Card`, `Separator`, `Text`, `Heading`, `Badge`, `Metric`, `Callout`
- JSON-driven UI renderer (`derives/json-render`) consuming React components
- shadcn registry (`derives/shadcn-registry`) for component distribution
- Demo Next.js app (`apps/demo`) with chat UI and JSON renderer

### Changed

- Reorganized directory structure into `components/`, `derives/`, `apps/`, `test/`
- Renamed all workspace packages to scoped `@minho-friends/friend-design-system--*` names
- Moved `components/lit` to Rollup build (previously `tsc` only)

[Unreleased]: https://github.com/minho-friends/friend-design-system/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/minho-friends/friend-design-system/releases/tag/v0.1.0
```

- [ ] **Step 2: Commit**

```bash
git add monorepo/CHANGELOG.md
git commit -m "chore: add CHANGELOG.md for v0.1.0

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Rewrite README.md

**Files:**

- Modify: `monorepo/README.md`

- [ ] **Step 1: Replace README content**

Replace the entire content of `monorepo/README.md` with:

````markdown
# @minho-friends/friend-design-system

A design system built with Lit web components and React, published as a single npm package with subpath exports.

## Install

```bash
npm install @minho-friends/friend-design-system
```
````

Peer dependencies required:

```bash
npm install lit react react-dom
```

## Usage

```ts
// Lit web components
import "@minho-friends/friend-design-system/lit";

// React components
import { Button } from "@minho-friends/friend-design-system/react";

// JSON-driven UI renderer
import { Renderer } from "@minho-friends/friend-design-system/json-render";
```

## Repository Structure

```
monorepo/
├── components/
│   ├── lit/           — Lit web components (Rollup build, lit as peer dep)
│   └── react/         — React wrappers around Lit components
├── derives/
│   ├── json-render/   — JSON-driven UI renderer (consumes React components)
│   └── shadcn-registry/ — shadcn component registry
├── apps/
│   └── demo/          — Next.js demo app
└── test/
    ├── e2e/
    ├── storybook-vite/
    ├── storybook-react/
    └── shadcn-registry-test/
```

## Build

```bash
# Build all packages
npx nx run-many --target=build

# Build a specific package
npx nx run @minho-friends/friend-design-system--lit:build
```

## Test

```bash
npx nx run-many --target=test
```

## License

MIT

````
- [ ] **Step 2: Commit**

```bash
git add monorepo/README.md
git commit -m "docs: rewrite README for RC

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
````

---

### Task 6: Verify all packages build and test clean

**Files:** (read-only verification, no changes)

- [ ] **Step 1: Run full build**

```bash
cd monorepo
npx nx run-many --target=build
```

Expected: all packages exit `0`. Any failure must be fixed before proceeding.

- [ ] **Step 2: Run full test suite**

```bash
npx nx run-many --target=test
```

Expected: all packages exit `0`. Note packages without a `test` script will be skipped by NX — that is acceptable.

- [ ] **Step 3: Confirm exports path in package.json**

```bash
node -e "import('./package.json', {assert:{type:'json'}}).then(m=>console.log(JSON.stringify(m.default.exports,null,2)))"
```

Expected output:

```json
{
  "./lit": "./components/lit/dist/index.js",
  "./react": "./components/react/dist/index.js",
  "./json-render": "./derives/json-render/dist/index.js"
}
```

- [ ] **Step 4: Commit verification tag commit (if all green)**

```bash
git tag rc/0.1.0
```

No push yet — that happens when the repo moves to GitHub.
