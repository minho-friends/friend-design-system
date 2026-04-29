# @minho-friends/friend-design-system

An experiment in **HTML-to-component pipeline automation** — discovering what spec format is rich enough to drive consistent design system generation from plain HTML.

---

## How It Started

Three hand-written HTML files: `lazy-simple-dashboard.sample1~3.html`. Minimal, functional admin dashboard pages — no framework, no components, just HTML and inline styles that worked.

The hypothesis was that an LLM could:
1. Read those HTML files and extract the design intent into `DESIGN.md`
2. Use `DESIGN.md` to generate reusable components
3. Automatically replace the original HTML with those generated components

**Step 1 succeeded.** The LLM produced a coherent `DESIGN.md` from the HTML samples — colors, typography, spacing rules, component shapes, interaction patterns.

**Step 2 partially succeeded.** The LLM generated components, but they diverged in subtle ways. The problem: `DESIGN.md` prose alone is not a precise enough contract for component generation. "Status badge with 3px border radius" is fine prose but doesn't specify props, variants, composability, or how it relates to the component hierarchy. The format wasn't the right container.

**Fix**: teach the LLM proper component design by grounding it in shadcn's architecture — registry types, variant systems, primitive vs. block vs. component distinctions. That study became `SPEC_primitives.md`. With that layer added, component generation became consistent and the original HTML could be replaced.

## The Spec Pipeline

```
DESIGN.md
  ↓ aesthetic intent (colors, typography, component behavior, interaction rules)
SPEC_primitives.md
  ↓ formal component catalog (props, variants, composability, registry types)
       ↓
    LLM generates
       ↓
  ┌────────────────────────────────────────────┐
  │ components/lit/     Lit 3 web components   │
  │ components/react/   React wrappers         │
  │ derives/json-render/  JSON → UI catalog    │
  │ derives/shadcn-registry/  shadcn registry  │
  └────────────────────────────────────────────┘

REQUIREMENTS_TEMPLATE.md
  ↓ per-page spec (composition, API shape, behavioral patterns, copy)
       ↓
    LLM generates
           ↓
        generated.html
               ↓
            (TODO: train to components, blocks -> shadcn-registry)
```

## The Loop This Closes

The deeper experiment is in `derives/json-render/`. It defines a Zod-validated catalog of the design system's components — the same components, expressed as a typed JSON schema that an LLM can emit reliably.

This means:
1. User types a natural language description ("show me a dashboard with these four services and their statuses")
2. LLM generates a typed JSON spec using the catalog
3. json-render renders it as actual design-system components

The `apps/demo` chat page (`/chat`) demonstrates this end-to-end. The AI isn't generating raw HTML or React — it's generating a structured object whose shape is constrained by the same Zod schemas that define the component props.

**Full loop**: prose design spec → LLM generates components → LLM generates JSON → UI renders live dashboards.

## What's Being Validated

**Confirmed so far:**
- LLM can reverse-engineer design intent from raw HTML into a structured spec
- A two-layer spec (DESIGN.md + SPEC_primitives.md) produces consistent components where DESIGN.md alone does not
- A Zod-validated JSON catalog (`json-render`) closes the loop to natural-language → rendered dashboard

**Open question — next phase:**

The spec pipeline still has a quality ceiling. Prose can describe intent; it cannot fully capture visual correctness. The plan is to move the original HTML samples into Figma (or an alternative), then create a feedback loop:

```
HTML samples → Figma
                 ↓
           visual ground truth
                 ↓
           LLM: update components to match
                 ↓
           components closer to original HTML
```

This tests whether a visual reference in the loop raises component quality above what markdown specs alone can achieve — and whether that loop can be automated or semi-automated.

The `propagate-lit-components` skill (`.claude/skills/`) is a side-effect of the experiment: it automates keeping React wrappers, json-render catalog, and shadcn registry in sync whenever the core Lit component props change — because manual propagation was the first friction point discovered.

---

## Getting Started

```bash
# Install all workspace dependencies
npm install

# Build all packages (nx affected)
npm run build
```

### Run dev servers

Start the portless proxy first, then any package:

```bash
# 1. proxy (run once in background)
npm run dev:proxy

# 2. pick a surface
cd apps/demo && npm run dev                     # http://ui-renderer.localhost
cd tests/storybook-vite && npm run storybook    # http://storybook.localhost
cd tests/storybook-react && npm run storybook   # http://storybook-react.localhost
cd tests/shadcn-registry-test && npm run dev    # http://shadcn-registry-test.localhost
```

| Package | Path | Command | Portless site |
|---------|------|---------|---------------|
| demo (v0 clone) | `apps/demo/` | `npm run dev` | `http://ui-renderer.localhost` |
| storybook-vite | `tests/storybook-vite/` | `npm run storybook` | `http://storybook.localhost` |
| storybook-react | `tests/storybook-react/` | `npm run storybook` | `http://storybook-react.localhost` |
| shadcn-registry-test | `tests/shadcn-registry-test/` | `npm run dev` | `http://shadcn-registry-test.localhost` |
| shadcn-registry-test (preview) | `tests/shadcn-registry-test/` | `npm run preview` | `http://shadcn-registry-test.localhost` |

### AI Chat setup

The `/chat` page requires an API key via environment variable. Without one, use `/chat#demo` for a pre-seeded demo run (no key required).

---

## Architecture

```
monorepo/
├── DESIGN.md           # Start point
├── SPEC_primitives.md  # Primitives Reference
├── .claude/skills/propagate-lit-components/SKILL.md  # (update belows)
├── components/
│   ├── lit/          # Core web components (framework-agnostic)
│   └── react/        # React wrappers
├── derives/
│   ├── json-render/  # JSON-spec → component renderer
│   └── shadcn-registry/ # shadcn/ui registry export
├── apps/
│   └── demo/         # v0 clone -- Next.js demo app (json-render + AI chat)
└── tests/
    ├── e2e/               # End-to-end tests
    ├── storybook-vite/    # Storybook for Lit components
    ├── storybook-react/   # Storybook for React wrappers
    └── shadcn-registry-test/ # Registry smoke tests
```

## Packages

| Package | Path | Description |
|---------|------|-------------|
| `@minho-friends/friend-design-system` | `/` | Root package with subpath exports (`./lit`, `./react`, `./json-render`) |
| `@minho-friends/friend-design-system--lit` | `components/lit/` | Lit 3 web components, built with Rollup |
| `@minho-friends/friend-design-system--react` | `components/react/` | React 19 wrappers via `@lit/react` |
| `@minho-friends/friend-design-system--json-render` | `derives/json-render/` | Zod-validated JSON catalog → React renderer |
| `@minho-friends/friend-design-system--shadcn-registry` | `derives/shadcn-registry/` | shadcn/ui compatible component registry |
| `@minho-friends/friend-design-system--demo` | `apps/demo/` | Next.js 15 demo app |
| `@minho-friends/friend-design-system--e2e` | `tests/e2e/` | E2E test harness |
| `@minho-friends/friend-design-system--storybook-vite` | `tests/storybook-vite/` | Storybook (Vite) for Lit |
| `@minho-friends/friend-design-system--storybook-react` | `tests/storybook-react/` | Storybook (Vite) for React |
| `@minho-friends/friend-design-system--shadcn-registry-test` | `tests/shadcn-registry-test/` | Registry integration test |

## Components (Lit)

### Layout
- `Stack` — flex container (vertical/horizontal)
- `Grid` — CSS grid with equal-width columns
- `Card` — bordered card with optional title/subtitle
- `Separator` — horizontal divider

### Text & Display
- `Text` — paragraph with size and muted variants
- `Heading` — h1–h6 section headings
- `Badge` — inline label with color variants (default/success/warning/error/info)
- `InfoText` — icon + label info line
- `Callout` — highlighted callout block

### Data & Metrics
- `Metric` — single key/value metric display
- `MetricsRow` — horizontal row of metrics
- `KeyValueList` — definition-style key/value pairs

### Status & Process
- `StatusBadge` — status pill (running/stopped/completed/disabled/unknown)
- `ProcessCard` — service/process card with status, metrics, and actions
- `TunnelEntry` — tunnel/port mapping entry

### Navigation & Controls
- `ActionGroup` — grouped action buttons
- `SearchFilterBar` — search input with filter controls
- `AdminPageHeader` — page header with title and actions
- `TreeNode` — collapsible tree item
- `CollapsibleFooter` — toggleable footer panel

## Dev Pages

### Demo App (`apps/demo`)

| Route | Description |
|-------|-------------|
| `/` | json-render demo — renders a static `demoSpec` using all catalog components |
| `/chat` | AI chat UI — describe a dashboard in plain text, get live-rendered components |
| `/chat#demo` | Demo mode — auto-sends a sample prompt without requiring an API key |

### Storybook Vite (`tests/storybook-vite`) — Lit components

| Story | Component |
|-------|-----------|
| `ActionGroup` | `<action-group>` |
| `AdminPageHeader` | `<admin-page-header>` |
| `CollapsibleFooter` | `<collapsible-footer>` |
| `InfoText` | `<info-text>` |
| `KeyValueList` | `<key-value-list>` |
| `MetricsRow` | `<metrics-row>` |
| `ProcessCard` | `<process-card>` |
| `SearchFilterBar` | `<search-filter-bar>` |
| `StatusBadge` | `<status-badge>` |
| `TreeNode` | `<tree-node>` |
| `TunnelEntry` | `<tunnel-entry>` |

### Storybook React (`tests/storybook-react`) — React wrappers

| Story | Component |
|-------|-----------|
| `MetricsRowReact` | `<MetricsRow>` |
| `ProcessCardReact` | `<ProcessCard>` |
| `SearchFilterBarReact` | `<SearchFilterBar>` |
| `StatusBadgeReact` | `<StatusBadge>` |

## Import

```ts
// Web components (any framework)
import "@minho-friends/friend-design-system/lit";

// React wrappers
import { ProcessCard, StatusBadge } from "@minho-friends/friend-design-system/react";

// JSON-driven renderer
import { catalog } from "@minho-friends/friend-design-system/json-render";
```

## Build

Nx orchestrates builds across the monorepo. Each package builds independently:

- `components/lit` — Rollup (ESM, externalized `lit`)
- `components/react` — `tsc`
- `derives/json-render` — `tsc`
- `derives/shadcn-registry` — `shadcn build`

```bash
# Build all affected packages
npm run build

# Build a specific package
cd components/lit && npm run build
```

## Roadmap

- [ ] P0 html→figma→lit components — back-propagate the whole design
- [ ] P0 train from generated samples to new components and blocks, and list to shadcn-registry
- [ ] P1 tailwind inject to react components?
- [ ] P2 A2UI demo
- [ ] P1 Release process:
  - [ ] P3 Publish to GitHub Packages (`npm registry`)
  - [ ] P3 Versioning strategy
  - [ ] P4 Automated version purge script for old releases
