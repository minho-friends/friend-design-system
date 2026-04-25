# Monorepo DESIGN.md → Frameworks Pipeline (Nx)

## Overview

Define a local, repeatable pipeline that starts from `monorepo/DESIGN.md` (plus `SPEC_primitives.md`) and produces consistent outputs across all frameworks listed in `monorepo/_planning.md`. The pipeline uses Nx to model dependencies and re-run only affected stages. After Lit components build, Storybook and an E2E verification step named `4-e2e-test-via-requirements` run before React generation.

## Goals

- Single local pipeline that keeps Lit, Storybook, React, shadcn registry, json-render, and demo-ui-renderer in sync.
- Automatic rebuilds when `DESIGN.md` or Lit components change, with accurate downstream invalidation.
- A review gate at the Storybook level with an E2E sample verification step driven by `REQUIREMENTS_TEMPLATE.md`.

## Non-goals

- CI integration.
- Introducing a different monorepo tool (e.g., Turborepo).

## Approaches Considered

1. **Node.js orchestrator + dependency graph**: explicit local script with staged execution and incremental logic.
2. **Chained package.json scripts**: simple but lacks incremental rebuild intelligence.
3. **Task runner with dependency graph (Nx)**: robust incremental rebuilds and project graph management.

**Decision:** Use **Nx** (Approach #3) to model the project graph and drive local automation.

## Architecture & Project Graph

Treat each directory as an Nx project, plus the E2E verification project:

- `components/lit`
- `tests/storybook-vite`
- `tests/e2e`
- `components/react`
- `derives/shadcn-registry`
- `derives/json-render`
- `apps/demo`

**Source of truth inputs:**

- `monorepo/DESIGN.md`
- `SPEC_primitives.md`

**Dependency flow (top → downstream):**

1. `design.md` + `SPEC_primitives.md` → `components/lit`
2. `components/lit` → `tests/storybook-vite`
3. `components/lit` → `tests/e2e`
4. `components/lit` → `components/react`
5. `components/react` → `derives/shadcn-registry`
6. `derives/shadcn-registry` → `derives/json-render`
7. `derives/json-render` → `apps/demo`

**Review gate placement:** After `tests/storybook-vite` and `tests/e2e` succeed and review is completed, proceed to `components/react`.

## Requirements Template Integration

`REQUIREMENTS_TEMPLATE.md` is used **only** by `tests/e2e`:

- It defines page composition and copy used to generate the demo page.
- It does **not** invalidate the Lit generation stage directly.

## Local Automation & Change Detection

- **Primary entrypoint:** `nx affected --target=build`
- **Explicit stage runs:** `nx run <project>:build`
- **Named inputs:** define `designSpec` in `nx.json` including `monorepo/DESIGN.md` and `SPEC_primitives.md`.
- **E2E inputs:** define `requirementsSpec` including `REQUIREMENTS_TEMPLATE.md` for `tests/e2e` only.
- Projects deriving from the spec include `inputs: ["default", "^default", "designSpec"]` so spec changes invalidate downstream stages.

## Verification & Review Gate

After `components/lit`:

- **Storybook build** (`tests/storybook-vite:build`) runs for visual review.
- **E2E verification** (`tests/e2e:build`) converts requirements-driven samples into a static demo page and validates render output.
- Both steps can run in parallel. Failure in either stops the pipeline.

## Project Responsibilities & Outputs

- `components/lit`: generates/maintains Lit components from primitives + design tokens; outputs web component package + typings.
- `tests/storybook-vite`: consumes Lit components; outputs Storybook build artifacts.
- `tests/e2e`: builds a demo page from requirements-driven samples and validates render output; outputs a static verification page.
- `components/react`: wraps or re-exports Lit components for React; outputs React component package.
- `derives/shadcn-registry`: packages React components for shadcn registry; outputs registry metadata + components.
- `derives/json-render`: consumes registry for JSON-driven UI; outputs renderable schema + bindings.
- `apps/demo`: end-to-end demo app using json-render; outputs runnable demo app.

## Error Handling

Any stage failure stops downstream stages. Failures surface as non-zero exit codes with concise logs; no silent fallbacks.
