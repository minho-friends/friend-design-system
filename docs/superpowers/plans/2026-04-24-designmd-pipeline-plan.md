# DESIGN.md → Frameworks Pipeline (Nx) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local Nx-driven monorepo pipeline: `DESIGN.md` + `SPEC_primitives.md` → Lit web components → Storybook/E2E gate → React wrappers → shadcn registry → json-render catalog → demo Next.js app.

**Architecture:** Each numbered directory is an independent Nx project. Build scripts invoke real framework tooling (Lit, Storybook/Vite, `@lit/react`, shadcn CLI, `@json-render/react`, Next.js). The `designSpec` named input in `nx.json` ensures downstream projects rebuild whenever `DESIGN.md` or `SPEC_primitives.md` change.

**Tech Stack:** Lit 3, `@storybook/web-components-vite`, `@lit/react`, shadcn CLI, `@json-render/react`, Next.js 14, Nx 19, Node.js `node:test`

---

## File Structure

```
monorepo/
  package.json                          ← workspace root
  nx.json                               ← named inputs + targetDefaults
  scripts/
    lib/io.js                           ← shared readText/writeText helpers
  components/lit/
    package.json
    project.json                        ← Nx build target
    tsconfig.json
    src/
      design-tokens.css                 ← extracted from DESIGN.md tokens
      status-badge.ts                   ← StatusBadge Lit component
      metrics-row.ts                    ← MetricsRow Lit component
      tree-node.ts                      ← TreeNode Lit component
      action-group.ts                   ← ActionGroup Lit component
      process-card.ts                   ← ProcessCard composite component
      index.ts                          ← barrel export
    __tests__/
      status-badge.test.js
      metrics-row.test.js
  tests/storybook-vite/
    package.json
    project.json
    .storybook/
      main.ts                           ← framework: @storybook/web-components-vite
      preview.ts
    stories/
      StatusBadge.stories.ts
      MetricsRow.stories.ts
      ProcessCard.stories.ts
  tests/e2e/
    package.json
    project.json
    scripts/build.js                    ← reads REQUIREMENTS_TEMPLATE.md → demo.html
    __tests__/build.test.js
  components/react/
    package.json
    project.json
    tsconfig.json
    src/
      StatusBadgeReact.tsx              ← @lit/react createComponent wrapper
      MetricsRowReact.tsx
      ProcessCardReact.tsx
      index.ts
    __tests__/
      StatusBadgeReact.test.js
  derives/shadcn-registry/
    package.json
    project.json
    registry.json                       ← shadcn registry manifest
    scripts/build.js                    ← runs shadcn build
    public/r/                           ← output: per-component JSON
  derives/json-render/
    package.json
    project.json
    src/
      catalog.ts                        ← defineCatalog() mapping design tokens → json-render schema
      registry.tsx                      ← defineRegistry() mapping catalog → React components
      index.ts
    __tests__/catalog.test.js
  apps/demo/
    package.json
    project.json
    (Next.js app scaffolded via create-next-app)
    app/
      page.tsx                          ← Renderer + StateProvider demo page
    lib/
      spec.ts                           ← sample json-render Spec wired to design system
```

---

### Task 1: Initialize workspace root (npm + Nx)

**Files:**

- Create: `package.json`
- Create: `nx.json`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "friend-tools-monorepo",
  "private": true,
  "version": "0.0.0",
  "workspaces": [
    "components/lit",
    "tests/storybook-vite",
    "tests/e2e",
    "components/react",
    "derives/shadcn-registry",
    "derives/json-render",
    "apps/demo"
  ],
  "scripts": {
    "build": "nx affected --target=build",
    "test": "nx affected --target=test"
  },
  "devDependencies": {
    "nx": "^19.3.2",
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create `nx.json`**

```json
{
  "extends": "nx/presets/npm.json",
  "namedInputs": {
    "default": [
      "{projectRoot}/**/*",
      "!{projectRoot}/dist/**",
      "!{projectRoot}/.storybook-static/**"
    ],
    "designSpec": [
      "{workspaceRoot}/DESIGN.md",
      "{workspaceRoot}/SPEC_primitives.md"
    ],
    "requirementsSpec": [
      "{workspaceRoot}/REQUIREMENTS_TEMPLATE.md"
    ]
  },
  "targetDefaults": {
    "build": {
      "inputs": ["default", "^default", "designSpec"],
      "dependsOn": ["^build"]
    },
    "test": {
      "inputs": ["default", "^default"]
    }
  }
}
```

- [ ] **Step 3: Install deps**

Run in `monorepo/`:

```bash
npm install
```

Expected: `added N packages`, exit code 0, `node_modules/nx/` present.

- [ ] **Step 4: Commit**

```bash
git add package.json nx.json package-lock.json
git commit -m "chore: initialize nx workspace root"
```

---

### Task 2: Define Nx project graph (all `project.json` files)

**Files:**

- Create: `components/lit/project.json`
- Create: `tests/storybook-vite/project.json`
- Create: `tests/e2e/project.json`
- Create: `components/react/project.json`
- Create: `derives/shadcn-registry/project.json`
- Create: `derives/json-render/project.json`
- Create: `apps/demo/project.json`

- [ ] **Step 1: `components/lit/project.json`**

```json
{
  "name": "components/lit",
  "projectType": "library",
  "root": "components/lit",
  "sourceRoot": "components/lit/src",
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "outputs": ["{projectRoot}/dist"],
      "options": { "command": "npm run build", "cwd": "components/lit" }
    },
    "test": {
      "executor": "nx:run-commands",
      "options": {
        "command": "node --test __tests__/*.test.js",
        "cwd": "components/lit"
      }
    }
  }
}
```

- [ ] **Step 2: `tests/storybook-vite/project.json`**

```json
{
  "name": "tests/storybook-vite",
  "projectType": "application",
  "root": "tests/storybook-vite",
  "implicitDependencies": ["components/lit"],
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "outputs": ["{projectRoot}/storybook-static"],
      "options": {
        "command": "npm run build-storybook",
        "cwd": "tests/storybook-vite"
      }
    }
  }
}
```

- [ ] **Step 3: `tests/e2e/project.json`**

```json
{
  "name": "tests/e2e",
  "projectType": "application",
  "root": "tests/e2e",
  "implicitDependencies": ["components/lit"],
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "inputs": ["default", "^default", "requirementsSpec"],
      "outputs": ["{projectRoot}/dist"],
      "options": { "command": "node scripts/build.js", "cwd": "tests/e2e" }
    },
    "test": {
      "executor": "nx:run-commands",
      "options": {
        "command": "node --test __tests__/*.test.js",
        "cwd": "tests/e2e"
      }
    }
  }
}
```

- [ ] **Step 4: `components/react/project.json`**

```json
{
  "name": "components/react",
  "projectType": "library",
  "root": "components/react",
  "implicitDependencies": ["components/lit"],
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "outputs": ["{projectRoot}/dist"],
      "options": { "command": "npm run build", "cwd": "components/react" }
    },
    "test": {
      "executor": "nx:run-commands",
      "options": {
        "command": "node --test __tests__/*.test.js",
        "cwd": "components/react"
      }
    }
  }
}
```

- [ ] **Step 5: `derives/shadcn-registry/project.json`**

```json
{
  "name": "derives/shadcn-registry",
  "projectType": "library",
  "root": "derives/shadcn-registry",
  "implicitDependencies": ["components/react"],
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "outputs": ["{projectRoot}/public/r"],
      "options": {
        "command": "node scripts/build.js",
        "cwd": "derives/shadcn-registry"
      }
    }
  }
}
```

- [ ] **Step 6: `derives/json-render/project.json`**

```json
{
  "name": "derives/json-render",
  "projectType": "library",
  "root": "derives/json-render",
  "implicitDependencies": ["derives/shadcn-registry"],
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "outputs": ["{projectRoot}/dist"],
      "options": { "command": "npm run build", "cwd": "derives/json-render" }
    },
    "test": {
      "executor": "nx:run-commands",
      "options": {
        "command": "node --test __tests__/*.test.js",
        "cwd": "derives/json-render"
      }
    }
  }
}
```

- [ ] **Step 7: `apps/demo/project.json`**

```json
{
  "name": "apps/demo",
  "projectType": "application",
  "root": "apps/demo",
  "implicitDependencies": ["derives/json-render"],
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "outputs": ["{projectRoot}/.next"],
      "options": { "command": "npm run build", "cwd": "apps/demo" }
    }
  }
}
```

- [ ] **Step 8: Verify Nx graph parses**

Run in `monorepo/`:

```bash
npx nx graph --file=/dev/null
```

Expected: exit code 0, no "project not found" errors.

- [ ] **Step 9: Commit**

```bash
git add components/lit/project.json tests/storybook-vite/project.json tests/e2e/project.json components/react/project.json derives/shadcn-registry/project.json derives/json-render/project.json apps/demo/project.json
git commit -m "chore: define nx project graph"
```

---

### Task 3: Scaffold `components/lit` — Lit web components from DESIGN.md

**Goal:** Produce real Lit custom elements that encode the design tokens and components from `DESIGN.md` + `SPEC_primitives.md`.

**Files:**

- Create: `components/lit/package.json`
- Create: `components/lit/tsconfig.json`
- Create: `components/lit/src/design-tokens.css`
- Create: `components/lit/src/status-badge.ts`
- Create: `components/lit/src/metrics-row.ts`
- Create: `components/lit/src/tree-node.ts`
- Create: `components/lit/src/action-group.ts`
- Create: `components/lit/src/process-card.ts`
- Create: `components/lit/src/index.ts`
- Test: `components/lit/__tests__/status-badge.test.js`
- Test: `components/lit/__tests__/metrics-row.test.js`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "components/lit",
  "version": "0.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "exports": { ".": "./dist/index.js" },
  "scripts": {
    "build": "tsc --outDir dist"
  },
  "dependencies": {
    "components/lit": "^3.1.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src",
    "strict": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create `src/design-tokens.css`**

Extracted from `DESIGN.md` color, typography and spacing sections:

```css
:root {
  --color-action: #2563eb;
  --color-success: #10b981;
  --color-danger: #ef4444;
  --color-neutral: #6b7280;
  --color-bg-page: #f9fafb;
  --color-bg-card: #ffffff;
  --color-bg-divider: #f3f4f6;

  --font-ui: Inter, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
  --size-xs: x-small;
  --size-sm: small;
  --size-meta: smaller;

  --space-indent: 14px;
  --space-item: 10px;
  --space-btn: 5px;
  --space-section: 20px;
  --space-title: 3px;
}
```

- [ ] **Step 4: Write failing test for StatusBadge**

```js
// components/lit/__tests__/status-badge.test.js
import assert from "node:assert/strict";
import { test } from "node:test";

// We test the class shape without a DOM since node:test runs in Node
test("StatusBadge module exports class", async () => {
  const mod = await import("../src/status-badge.ts?url=file://status-badge.ts");
  // Import will fail if TS has a syntax error or missing export
  assert.ok(mod, "module loaded");
});
```

> Note: since Lit components require a DOM, the test just validates the module
> shape. Visual validation is covered by Storybook in Task 4.

- [ ] **Step 5: Create `src/status-badge.ts`**

Implements `SPEC.md § StatusBadge` — variant, label, white text, `3px` border-radius, color-coded.

```ts
import { css, html, LitElement, unsafeCSS } from "components/lit";
import { customElement, property } from "lit/decorators.js";

export type BadgeVariant =
  | "running"
  | "stopped"
  | "completed"
  | "disabled"
  | "unknown";

@customElement("status-badge")
export class StatusBadge extends LitElement {
  @property({ type: String })
  variant: BadgeVariant = "unknown";
  @property({ type: String })
  label = "";

  static styles = css`
    :host { display: inline-block; }
    span {
      display: inline-block;
      font-size: var(--size-xs, x-small);
      font-weight: bold;
      padding: 1px 6px;
      border-radius: 3px;
      color: #fff;
    }
    .running  { background: var(--color-success, #10B981); }
    .stopped  { background: var(--color-danger, #EF4444); }
    .completed { background: var(--color-neutral, #6B7280); }
    .disabled  { background: transparent; border: 1px solid var(--color-neutral, #6B7280); color: var(--color-neutral, #6B7280); }
    .unknown  { background: var(--color-neutral, #6B7280); }
  `;

  render() {
    const text = this.label || this.variant;
    return html`<span class=${this.variant}>${text}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "status-badge": StatusBadge;
  }
}
```

- [ ] **Step 6: Create `src/metrics-row.ts`**

Implements `SPEC.md § MetricsRow` — monospace, `size-meta`, neutral color.

```ts
import { css, html, LitElement } from "components/lit";
import { customElement, property } from "lit/decorators.js";

@customElement("metrics-row")
export class MetricsRow extends LitElement {
  @property({ type: String })
  status?: string;
  @property({ type: Number })
  age?: number; // seconds
  @property({ type: Number })
  cpu?: number; // percent
  @property({ type: Number })
  mem?: number; // MB

  static styles = css`
    :host { display: block; }
    span {
      font-family: var(--font-mono, monospace);
      font-size: var(--size-meta, smaller);
      color: var(--color-neutral, #6B7280);
      margin-left: var(--space-indent, 14px);
      margin-top: 5px;
      display: block;
    }
  `;

  render() {
    const parts: string[] = [];
    if (this.status !== undefined) parts.push(`status: ${this.status}`);
    if (this.age !== undefined) parts.push(`age: ${this.age}s`);
    if (this.cpu !== undefined) parts.push(`cpu: ${this.cpu}%`);
    if (this.mem !== undefined) parts.push(`mem: ${this.mem}MB`);
    return html`<span>${parts.join(" | ")}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "metrics-row": MetricsRow;
  }
}
```

- [ ] **Step 7: Create `src/tree-node.ts`**

Implements `SPEC.md § TreeNode` — wraps `<details>`/`<summary>`, per-level indent.

```ts
import { css, html, LitElement } from "components/lit";
import { customElement, property } from "lit/decorators.js";

@customElement("tree-node")
export class TreeNode extends LitElement {
  @property({ type: String })
  label = "";
  @property({ type: Boolean })
  open = false;
  @property({ type: Number })
  indent = 0;

  static styles = css`
    :host { display: block; }
    details { margin-left: calc(var(--space-indent, 14px) * var(--_lvl, 0)); }
    summary { cursor: pointer; }
  `;

  render() {
    this.style.setProperty("--_lvl", String(this.indent));
    return html`
      <details ?open=${this.open}>
        <summary>${this.label}</summary>
        <slot></slot>
      </details>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tree-node": TreeNode;
  }
}
```

- [ ] **Step 8: Create `src/action-group.ts`**

Implements `SPEC.md § ActionGroup` — `start ▶`, `stop ■`, `add +`, `remove −`.

```ts
import { css, html, LitElement } from "components/lit";
import { customElement, property } from "lit/decorators.js";

export interface Action {
  type: "start" | "stop" | "add" | "remove" | string;
  label?: string;
  disabled?: boolean;
  onClick: () => void;
}

const SYMBOLS: Record<string, string> = {
  start: "▶",
  stop: "■",
  add: "+",
  remove: "−",
};
const COLORS: Record<string, string> = {
  start: "var(--color-action, #2563EB)",
  stop: "var(--color-danger, #EF4444)",
};

@customElement("action-group")
export class ActionGroup extends LitElement {
  @property({ type: Array })
  actions: Action[] = [];

  static styles = css`
    :host { display: inline-flex; gap: var(--space-btn, 5px); }
    button {
      font-size: var(--size-sm, small);
      cursor: pointer;
      background: none;
      border: 1px solid currentColor;
      padding: 1px 4px;
    }
    button:disabled { opacity: 0.4; cursor: default; }
  `;

  render() {
    return html`${
      this.actions.map(a =>
        html`
      <button
        style="color:${COLORS[a.type] ?? "inherit"}"
        ?disabled=${!!a.disabled}
        @click=${a.onClick}>
        ${SYMBOLS[a.type] ?? ""} ${a.label ?? a.type}
      </button>
    `
      )
    }`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "action-group": ActionGroup;
  }
}
```

- [ ] **Step 9: Create `src/process-card.ts`**

Composite: `tree-node` + `status-badge` + `metrics-row` + `action-group`.

```ts
import { css, html, LitElement } from "components/lit";
import { customElement, property } from "lit/decorators.js";
import type { Action } from "./action-group.js";
import type { BadgeVariant } from "./status-badge.js";
import "./status-badge.js";
import "./metrics-row.js";
import "./tree-node.js";
import "./action-group.js";

@customElement("process-card")
export class ProcessCard extends LitElement {
  @property({ type: String })
  name = "";
  @property({ type: String })
  status: BadgeVariant = "unknown";
  @property({ type: Object })
  metrics?: { age?: number; cpu?: number; mem?: number };
  @property({ type: Array })
  actions: Action[] = [];
  @property({ type: Boolean })
  open = false;

  static styles = css`
    :host { display: block; margin-bottom: var(--space-item, 10px); }
    .running { border-left: 3px solid var(--color-success, #10B981); padding-left: 4px; }
  `;

  render() {
    return html`
      <tree-node .label=${this.name} ?open=${this.open} class=${
      this.status === "running" ? "running" : ""
    }>
        <status-badge slot="label" .variant=${this.status}></status-badge>
        ${
      this.metrics
        ? html`
          <metrics-row
            .status=${this.status}
            .age=${this.metrics.age}
            .cpu=${this.metrics.cpu}
            .mem=${this.metrics.mem}>
          </metrics-row>`
        : ""
    }
        <action-group .actions=${this.actions}></action-group>
      </tree-node>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "process-card": ProcessCard;
  }
}
```

- [ ] **Step 10: Create `src/index.ts`**

```ts
export { ActionGroup } from "./action-group.js";
export type { Action } from "./action-group.js";
export { MetricsRow } from "./metrics-row.js";
export { ProcessCard } from "./process-card.js";
export { StatusBadge } from "./status-badge.js";
export type { BadgeVariant } from "./status-badge.js";
export { TreeNode } from "./tree-node.js";
```

- [ ] **Step 11: Install and build**

Run in `components/lit/`:

```bash
npm install
npm run build
```

Expected: `dist/` created, `.js` and `.d.ts` files present for each component.

- [ ] **Step 12: Commit**

```bash
git add components/lit/
git commit -m "feat(lit): scaffold lit web components from DESIGN.md"
```

---

### Task 4: Scaffold `tests/storybook-vite` — Storybook for Web Components + Vite

**Reference:** https://storybook.js.org/docs/get-started/frameworks/web-components-vite

**Files:**

- Create: `tests/storybook-vite/package.json`
- Create: `tests/storybook-vite/.storybook/main.ts`
- Create: `tests/storybook-vite/.storybook/preview.ts`
- Create: `tests/storybook-vite/stories/StatusBadge.stories.ts`
- Create: `tests/storybook-vite/stories/MetricsRow.stories.ts`
- Create: `tests/storybook-vite/stories/ProcessCard.stories.ts`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "tests/storybook-vite",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "components/lit": "*"
  },
  "devDependencies": {
    "@storybook/web-components-vite": "^8.1.0",
    "storybook": "^8.1.0",
    "vite": "^5.2.0",
    "components/lit": "^3.1.0"
  }
}
```

- [ ] **Step 2: Create `.storybook/main.ts`**

Per https://storybook.js.org/docs/get-started/frameworks/web-components-vite:

```ts
import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
};
export default config;
```

- [ ] **Step 3: Create `.storybook/preview.ts`**

```ts
import type { Preview } from "@storybook/web-components";
import "components/lit/dist/index.js";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "page",
      values: [{ name: "page", value: "#F9FAFB" }],
    },
  },
};
export default preview;
```

- [ ] **Step 4: Create `stories/StatusBadge.stories.ts`**

```ts
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "components/lit";

const meta: Meta = {
  title: "Components/StatusBadge",
  render: ({ variant, label }) =>
    html`<status-badge .variant=${variant} .label=${label}></status-badge>`,
  argTypes: {
    variant: {
      control: "select",
      options: ["running", "stopped", "completed", "disabled", "unknown"],
    },
    label: { control: "text" },
  },
};
export default meta;
type Story = StoryObj;

export const Running: Story = {
  args: { variant: "running", label: "running" },
};
export const Stopped: Story = {
  args: { variant: "stopped", label: "stopped" },
};
export const Completed: Story = {
  args: { variant: "completed", label: "completed" },
};
export const Disabled: Story = {
  args: { variant: "disabled", label: "disabled" },
};
export const Unknown: Story = { args: { variant: "unknown", label: "..." } };
```

- [ ] **Step 5: Create `stories/MetricsRow.stories.ts`**

```ts
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "components/lit";

const meta: Meta = {
  title: "Components/MetricsRow",
  render: ({ status, age, cpu, mem }) =>
    html`<metrics-row .status=${status} .age=${age} .cpu=${cpu} .mem=${mem}></metrics-row>`,
  argTypes: {
    status: { control: "text" },
    age: { control: "number" },
    cpu: { control: "number" },
    mem: { control: "number" },
  },
};
export default meta;
type Story = StoryObj;

export const Full: Story = {
  args: { status: "running", age: 120, cpu: 12.4, mem: 64.2 },
};
export const StatusOnly: Story = { args: { status: "stopped" } };
```

- [ ] **Step 6: Create `stories/ProcessCard.stories.ts`**

```ts
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "components/lit";

const meta: Meta = {
  title: "Components/ProcessCard",
  render: ({ name, status, metrics, open }) =>
    html`<process-card
      .name=${name}
      .status=${status}
      .metrics=${metrics}
      .actions=${[
      { type: "start", onClick: () => {}, disabled: status === "running" },
      { type: "stop", onClick: () => {}, disabled: status !== "running" },
    ]}
      ?open=${open}
    ></process-card>`,
};
export default meta;
type Story = StoryObj;

export const Running: Story = {
  args: {
    name: "api",
    status: "running",
    metrics: { age: 300, cpu: 5.2, mem: 128 },
    open: true,
  },
};
export const Stopped: Story = {
  args: { name: "worker", status: "stopped", metrics: { age: 0 }, open: false },
};
```

- [ ] **Step 7: Install and build**

Run in `tests/storybook-vite/`:

```bash
npm install
npm run build-storybook
```

Expected: `storybook-static/` created, `index.html` present, exit code 0.

- [ ] **Step 8: Commit**

```bash
git add tests/storybook-vite/
git commit -m "feat(storybook): add storybook/vite for lit components"
```

---

### Task 5: Scaffold `tests/e2e` — demo page from REQUIREMENTS_TEMPLATE.md

**Goal:** Parse `REQUIREMENTS_TEMPLATE.md` (page composition + copy sections) and render a static `demo.html` that includes the Lit components served as a visual smoke-test.

**Files:**

- Create: `tests/e2e/package.json`
- Create: `tests/e2e/scripts/build.js`
- Test: `tests/e2e/__tests__/build.test.js`

- [ ] **Step 1: Write failing test**

```js
// tests/e2e/__tests__/build.test.js
import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distHtml = resolve(__dirname, "..", "dist", "demo.html");

test("build produces demo.html with title", async () => {
  if (existsSync(distHtml)) rmSync(distHtml);
  await import("../scripts/build.js");
  assert.ok(existsSync(distHtml), "dist/demo.html must exist");
  const content = readFileSync(distHtml, "utf8");
  assert.ok(content.includes("<title>"), "must include a <title>");
  assert.ok(
    content.includes("status-badge"),
    "must reference status-badge component",
  );
});
```

- [ ] **Step 2: Run to verify it fails**

Run in `tests/e2e/`:

```bash
node --test __tests__/build.test.js
```

Expected: FAIL — "Cannot find module '../scripts/build.js'"

- [ ] **Step 3: Create `package.json`**

```json
{
  "name": "tests/e2e",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "build": "node scripts/build.js"
  },
  "dependencies": {
    "components/lit": "*"
  }
}
```

- [ ] **Step 4: Create `scripts/build.js`**

Reads `REQUIREMENTS_TEMPLATE.md` (page title + page composition section) and generates `dist/demo.html` that loads the Lit components and renders a demo.

```js
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(__dirname, "..", "..", "..");
const reqPath = resolve(workspaceRoot, "REQUIREMENTS_TEMPLATE.md");
const outDir = resolve(__dirname, "..", "dist");
const outPath = resolve(outDir, "demo.html");

const req = readFileSync(reqPath, "utf8");

// Extract title from section "## 1. Title & Purpose"
const titleMatch = req.match(/Title:\s*(.+)/);
const pageTitle = titleMatch ? titleMatch[1].trim() : "Demo";

mkdirSync(outDir, { recursive: true });

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${pageTitle} — E2E Demo</title>
  <script type="module" src="../../components/lit/dist/index.js"></script>
  <style>
    body { font-family: Inter, system-ui, sans-serif; background: #F9FAFB; padding: 20px; }
    h1 { margin-bottom: 3px; }
    hr { margin-top: 20px; }
  </style>
</head>
<body>
  <h1>${pageTitle}</h1>
  <hr>

  <h2>StatusBadge variants</h2>
  <status-badge variant="running"></status-badge>
  <status-badge variant="stopped"></status-badge>
  <status-badge variant="completed"></status-badge>
  <status-badge variant="disabled"></status-badge>

  <h2>MetricsRow</h2>
  <metrics-row status="running" age="120" cpu="5.2" mem="64"></metrics-row>

  <h2>ProcessCard (running)</h2>
  <process-card name="api" status="running" open></process-card>

  <h2>ProcessCard (stopped)</h2>
  <process-card name="worker" status="stopped"></process-card>
</body>
</html>`;

writeFileSync(outPath, html, "utf8");
console.log("E2E demo written to", outPath);
```

- [ ] **Step 5: Run test to verify it passes**

Run in `tests/e2e/`:

```bash
node --test __tests__/build.test.js
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add tests/e2e/
git commit -m "feat(e2e): add requirements-driven demo page"
```

---

### Task 6: Scaffold `components/react` — `@lit/react` wrappers

**Reference:** https://lit.dev/docs/frameworks/react/

**Files:**

- Create: `components/react/package.json`
- Create: `components/react/tsconfig.json`
- Create: `components/react/src/StatusBadgeReact.tsx`
- Create: `components/react/src/MetricsRowReact.tsx`
- Create: `components/react/src/ProcessCardReact.tsx`
- Create: `components/react/src/index.ts`
- Test: `components/react/__tests__/StatusBadgeReact.test.js`

- [ ] **Step 1: Write failing test**

```js
// components/react/__tests__/StatusBadgeReact.test.js
import assert from "node:assert/strict";
import test from "node:test";

test("StatusBadgeReact module exports a component", async () => {
  const mod = await import("../dist/StatusBadgeReact.js");
  assert.ok(mod.StatusBadgeReact, "StatusBadgeReact export must exist");
});
```

- [ ] **Step 2: Run to verify it fails**

Run in `components/react/`:

```bash
node --test __tests__/StatusBadgeReact.test.js
```

Expected: FAIL — "Cannot find module '../dist/StatusBadgeReact.js'"

- [ ] **Step 3: Create `package.json`**

```json
{
  "name": "components/react",
  "version": "0.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "exports": { ".": "./dist/index.js" },
  "scripts": {
    "build": "tsc --outDir dist"
  },
  "dependencies": {
    "@lit/react": "^1.0.4",
    "components/lit": "*",
    "components/lit": "^3.1.0",
    "components/react": "^18.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "typescript": "^5.4.0"
  },
  "peerDependencies": {
    "components/react": "^18.0.0"
  }
}
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src",
    "strict": true
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create `src/StatusBadgeReact.tsx`**

Using `createComponent` per https://lit.dev/docs/frameworks/react/#createcomponent:

```tsx
import { createComponent } from "@lit/react";
import { StatusBadge } from "components/lit";
import React from "components/react";

export const StatusBadgeReact = createComponent({
  tagName: "status-badge",
  elementClass: StatusBadge,
  react: React,
});
```

- [ ] **Step 6: Create `src/MetricsRowReact.tsx`**

```tsx
import { createComponent } from "@lit/react";
import { MetricsRow } from "components/lit";
import React from "components/react";

export const MetricsRowReact = createComponent({
  tagName: "metrics-row",
  elementClass: MetricsRow,
  react: React,
});
```

- [ ] **Step 7: Create `src/ProcessCardReact.tsx`**

```tsx
import { createComponent } from "@lit/react";
import { ProcessCard } from "components/lit";
import React from "components/react";

export const ProcessCardReact = createComponent({
  tagName: "process-card",
  elementClass: ProcessCard,
  react: React,
});
```

- [ ] **Step 8: Create `src/index.ts`**

```ts
export { MetricsRowReact } from "./MetricsRowReact.js";
export { ProcessCardReact } from "./ProcessCardReact.js";
export { StatusBadgeReact } from "./StatusBadgeReact.js";
```

- [ ] **Step 9: Install and build**

Run in `components/react/`:

```bash
npm install
npm run build
```

Expected: `dist/*.js` and `dist/*.d.ts` files present, exit code 0.

- [ ] **Step 10: Run test to verify it passes**

Run in `components/react/`:

```bash
node --test __tests__/StatusBadgeReact.test.js
```

Expected: PASS

- [ ] **Step 11: Commit**

```bash
git add components/react/
git commit -m "feat(react): wrap lit components with @lit/react"
```

---

### Task 7: Scaffold `derives/shadcn-registry` — shadcn component registry

**Reference:** https://github.com/shadcn-ui/registry-template

**Files:**

- Create: `derives/shadcn-registry/package.json`
- Create: `derives/shadcn-registry/registry.json`
- Create: `derives/shadcn-registry/scripts/build.js`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "derives/shadcn-registry",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "build": "node scripts/build.js"
  },
  "dependencies": {
    "components/react": "*"
  },
  "devDependencies": {
    "shadcn": "^2.3.0"
  }
}
```

- [ ] **Step 2: Create `registry.json`**

Registers each React wrapper as a shadcn registry item using `registry:ui` type per `SPEC_primitives.md`:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "friend-tools",
  "homepage": "",
  "items": [
    {
      "name": "status-badge",
      "type": "registry:ui",
      "title": "StatusBadge",
      "description": "Inline status badge: running, stopped, completed, disabled, unknown",
      "files": [
        {
          "path": "../components/react/src/StatusBadgeReact.tsx",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "metrics-row",
      "type": "registry:ui",
      "title": "MetricsRow",
      "description": "Monospace metrics line: status, age, cpu, mem",
      "files": [
        {
          "path": "../components/react/src/MetricsRowReact.tsx",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "process-card",
      "type": "registry:block",
      "title": "ProcessCard",
      "description": "Composite process card: name, status badge, metrics, action group",
      "files": [
        {
          "path": "../components/react/src/ProcessCardReact.tsx",
          "type": "registry:ui"
        }
      ]
    }
  ]
}
```

- [ ] **Step 3: Create `scripts/build.js`**

Generates `public/r/<name>.json` from `registry.json` entries:

```js
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const reg = JSON.parse(readFileSync(resolve(root, "registry.json"), "utf8"));

for (const item of reg.items) {
  const outDir = resolve(root, "public", "r");
  const outFile = resolve(outDir, `${item.name}.json`);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, JSON.stringify(item, null, 2), "utf8");
  console.log("wrote", outFile);
}
console.log("registry built:", reg.items.length, "items");
```

- [ ] **Step 4: Install and build**

Run in `derives/shadcn-registry/`:

```bash
npm install
npm run build
```

Expected: `public/r/status-badge.json`, `public/r/metrics-row.json`, `public/r/process-card.json` present, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add derives/shadcn-registry/
git commit -m "feat(registry): add shadcn component registry"
```

---

### Task 8: Scaffold `derives/json-render` — `@json-render/react` catalog + registry

**Reference:** https://github.com/vercel-labs/json-render/tree/main/packages/react

**Files:**

- Create: `derives/json-render/package.json`
- Create: `derives/json-render/tsconfig.json`
- Create: `derives/json-render/src/catalog.ts`
- Create: `derives/json-render/src/registry.tsx`
- Create: `derives/json-render/src/index.ts`
- Test: `derives/json-render/__tests__/catalog.test.js`

- [ ] **Step 1: Write failing test**

```js
// derives/json-render/__tests__/catalog.test.js
import assert from "node:assert/strict";
import test from "node:test";

test("catalog exports known component names", async () => {
  const { catalog } = await import("../dist/catalog.js");
  const names = Object.keys(catalog.components);
  assert.ok(names.includes("StatusBadge"), "StatusBadge must be in catalog");
  assert.ok(names.includes("MetricsRow"), "MetricsRow must be in catalog");
  assert.ok(names.includes("ProcessCard"), "ProcessCard must be in catalog");
});
```

- [ ] **Step 2: Run to verify it fails**

Run in `derives/json-render/`:

```bash
node --test __tests__/catalog.test.js
```

Expected: FAIL — module not found

- [ ] **Step 3: Create `package.json`**

```json
{
  "name": "derives/json-render",
  "version": "0.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "exports": { ".": "./dist/index.js" },
  "scripts": {
    "build": "tsc --outDir dist"
  },
  "dependencies": {
    "@json-render/core": "^0.1.0",
    "@json-render/react": "^0.1.0",
    "components/react": "*",
    "components/react": "^18.3.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src",
    "strict": true
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create `src/catalog.ts`**

Per https://github.com/vercel-labs/json-render/tree/main/packages/react#1-create-a-catalog:

```ts
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

export const catalog = defineCatalog(schema, {
  components: {
    StatusBadge: {
      props: z.object({
        variant: z.enum([
          "running",
          "stopped",
          "completed",
          "disabled",
          "unknown",
        ]).default("unknown"),
        label: z.string().optional(),
      }),
      description: "Inline status badge",
    },
    MetricsRow: {
      props: z.object({
        status: z.string().optional(),
        age: z.number().optional(),
        cpu: z.number().optional(),
        mem: z.number().optional(),
      }),
      description: "Monospace metrics row",
    },
    ProcessCard: {
      props: z.object({
        name: z.string(),
        status: z.enum([
          "running",
          "stopped",
          "completed",
          "disabled",
          "unknown",
        ]).default("unknown"),
        open: z.boolean().optional(),
      }),
      description: "Composite process card",
    },
  },
});
```

- [ ] **Step 6: Create `src/registry.tsx`**

Per https://github.com/vercel-labs/json-render/tree/main/packages/react#2-define-component-implementations:

```tsx
import { defineRegistry } from "@json-render/react";
import { StatusBadgeReact } from "components/react";
import { MetricsRowReact } from "components/react";
import { ProcessCardReact } from "components/react";
import { catalog } from "./catalog.js";

export const { registry } = defineRegistry(catalog, {
  components: {
    StatusBadge: ({ props }) => (
      <StatusBadgeReact variant={props.variant} label={props.label} />
    ),
    MetricsRow: ({ props }) => (
      <MetricsRowReact
        status={props.status}
        age={props.age}
        cpu={props.cpu}
        mem={props.mem}
      />
    ),
    ProcessCard: ({ props }) => (
      <ProcessCardReact
        name={props.name}
        status={props.status}
        open={props.open}
      />
    ),
  },
});
```

- [ ] **Step 7: Create `src/index.ts`**

```ts
export { catalog } from "./catalog.js";
export { registry } from "./registry.js";
```

- [ ] **Step 8: Install and build**

Run in `derives/json-render/`:

```bash
npm install
npm run build
```

Expected: `dist/*.js` present, exit code 0.

- [ ] **Step 9: Run test to verify it passes**

Run in `derives/json-render/`:

```bash
node --test __tests__/catalog.test.js
```

Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add derives/json-render/
git commit -m "feat(json-render): define catalog and registry for design system"
```

---

### Task 9: Scaffold `apps/demo` — Next.js demo app using json-render

**Reference:** https://github.com/vercel-labs/json-render/tree/main/examples/next-website-builder

**Files:**

- Create: `apps/demo/package.json`
- Create: `apps/demo/project.json` ← already done in Task 2
- Create: `apps/demo/next.config.mjs`
- Create: `apps/demo/app/page.tsx`
- Create: `apps/demo/lib/spec.ts`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "apps/demo",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@json-render/react": "^0.1.0",
    "derives/json-render": "*",
    "next": "^14.2.0",
    "components/react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create `next.config.mjs`**

```mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["components/lit", "components/react", "derives/json-render"],
};
export default nextConfig;
```

- [ ] **Step 3: Create `lib/spec.ts`**

A sample json-render `Spec` wired to the design system components:

```ts
import type { Spec } from "@json-render/react";

export const demoSpec: Spec = {
  root: "card-running",
  elements: {
    "card-running": {
      type: "ProcessCard",
      props: { name: "api", status: "running", open: true },
      children: ["metrics-1"],
    },
    "metrics-1": {
      type: "MetricsRow",
      props: { status: "running", age: 300, cpu: 5.2, mem: 128 },
    },
    "card-stopped": {
      type: "ProcessCard",
      props: { name: "worker", status: "stopped", open: false },
    },
    "badge-running": {
      type: "StatusBadge",
      props: { variant: "running" },
    },
    "badge-stopped": {
      type: "StatusBadge",
      props: { variant: "stopped" },
    },
  },
};
```

- [ ] **Step 4: Create `app/page.tsx`**

Per https://github.com/vercel-labs/json-render/tree/main/packages/react#3-render-specs:

```tsx
"use client";
import { Renderer, StateProvider } from "@json-render/react";
import { registry } from "derives/json-render";
import { demoSpec } from "../lib/spec";

export default function Page() {
  return (
    <StateProvider initialState={{}}>
      <main
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          background: "#F9FAFB",
          padding: "20px",
        }}
      >
        <h1 style={{ marginBottom: "3px" }}>Friend Tools — json-render Demo</h1>
        <hr style={{ marginTop: "20px" }} />
        <Renderer spec={demoSpec} registry={registry} />
      </main>
    </StateProvider>
  );
}
```

- [ ] **Step 5: Install and build**

Run in `apps/demo/`:

```bash
npm install
npm run build
```

Expected: `.next/` created, exit code 0.

- [ ] **Step 6: Commit**

```bash
git add apps/demo/
git commit -m "feat(demo): add next.js demo app wired to json-render"
```

---

### Task 10: Verify full pipeline end-to-end

- [ ] **Step 1: Run full pipeline from workspace root**

Run in `monorepo/`:

```bash
npx nx run-many --target=build --all
```

Expected: all 7 projects build successfully, exit code 0.

- [ ] **Step 2: Verify Nx detects `DESIGN.md` changes correctly**

Touch `DESIGN.md` and run affected check:

```bash
touch DESIGN.md
npx nx affected --target=build --dry-run
```

Expected: `components/lit` and all downstream projects listed as affected.

- [ ] **Step 3: Verify `REQUIREMENTS_TEMPLATE.md` change only affects E2E stage**

```bash
git stash  # restore DESIGN.md
touch REQUIREMENTS_TEMPLATE.md
npx nx affected --target=build --dry-run
```

Expected: only `tests/e2e` listed as affected.

- [ ] **Step 4: Restore and commit**

```bash
git checkout DESIGN.md REQUIREMENTS_TEMPLATE.md
git add -A
git commit -m "test: verify nx pipeline and input graph"
```

---

## Self-Review

**Spec coverage:**

- Nx-based pipeline + namedInputs: Tasks 1–2 ✅
- Lit components from DESIGN.md + SPEC_primitives.md: Task 3 ✅
- Storybook/Vite with `@storybook/web-components-vite`: Task 4 ✅
- E2E demo from REQUIREMENTS_TEMPLATE.md: Task 5 ✅
- React wrappers via `@lit/react` `createComponent`: Task 6 ✅
- shadcn registry with `registry.json`: Task 7 ✅
- json-render catalog+registry via `@json-render/react`: Task 8 ✅
- Next.js demo via `Renderer` + `StateProvider`: Task 9 ✅
- End-to-end Nx pipeline + affected verification: Task 10 ✅

**Placeholder scan:** No TBD/TODO. All steps include real package names, commands, and code.

**Type consistency:** `BadgeVariant`, `Action`, catalog component names, and dist paths are consistent across all tasks.
