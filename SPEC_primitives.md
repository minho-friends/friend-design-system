# Friend Tools Design System — Primitives Reference

All-in-one reference. Six layers: overview → design tokens → styled native HTML → shadcn primitives → our custom components + additional shadcn coverages → behavioral patterns.

### Registry type summary

| Item | Type |
|---|---|
| Design system (this file) | `registry:base` |
| Color + spacing tokens | `registry:theme` |
| Font definitions | `registry:font` |
| Native element styles | `registry:style` |
| Button, Badge, Collapsible, Toggle, Switch, ScrollArea, Tooltip | `registry:ui` |
| DataTable | `registry:block` |
| StatusBadge, MetricsRow, KeyValueList, InfoText, SearchFilterBar, TreeNode, ActionGroup | `registry:ui` |
| ProcessCard, TunnelEntry | `registry:block` |
| AdminPageHeader, CollapsibleFooter | `registry:component` |
| Card, Alert, Skeleton, Field, Spinner, Empty | `registry:ui` |
| Command | `registry:block` |
| useWriteGate, useDestructiveConfirm, useLoadingLock | `registry:hook` |
| Bulk Actions | `registry:block` |
| Real-time Status Indicators | `registry:style` |

---

## Overview

Minimal, utilitarian internal admin dashboard system. Built for trusted operators who need information density, fast scanning, and safe-but-direct controls. No decorative chrome — every element earns its place.

**Audience:** Internal tools, friend-group dashboards, personal infra admin panels.

**Guiding principles:**
- Information density over whitespace
- Native elements over custom
- Status through color, not icons
- One loading lock per page
- Type-to-confirm for destruction

---

## Page Layout

Every page follows this three-zone structure:

```
┌─────────────────────────────────────┐
│  AdminPageHeader (sticky optional)  │
│  title · actions · stats            │
├─────────────────────────────────────┤
│  Main content                       │
│  Responsive list or grid of cards   │
│  (ProcessCard / TunnelEntry / etc.) │
├─────────────────────────────────────┤
│  CollapsibleFooter (sticky optional)│
│  reference info · FAQ · about       │
└─────────────────────────────────────┘
```

- Header and footer are separated from main content by `<hr>` (`space-section` top margin)
- Top-level items have `space-item` (10px) bottom margin between them
- Nested content indented `space-indent` (14px) per level
- When both StickyHeader and StickyFooter are active, main content must have matching top + bottom padding to avoid occlusion

---

## Token Reference · `registry:theme` · `registry:font`

### shadcn CSS Variables → Design Tokens

| shadcn variable | Token | Value |
|---|---|---|
| `--primary` | `color-action` | #2563EB |
| `--color-success` | `color-success` | #10B981 |
| `--destructive` | `color-danger` | #EF4444 |
| `--muted-foreground` | `color-neutral` | #6B7280 |
| `--background` | `color-bg-page` | #F9FAFB |
| `--card` | `color-bg-card` | #FFFFFF |
| `--border` | `color-bg-divider` | #F3F4F6 |
| `--font-sans` | `font-ui` | Inter / system sans-serif |
| `--font-mono` | `font-mono` | JetBrains Mono / Fira Code |
| `--radius` | — | 0px (except Badge: 3px locally) |

### Spacing Tokens

| Token | Value | Usage |
|---|---|---|
| `space-indent` | 14px | Per nesting level in tree |
| `space-item` | 10px | Bottom margin between top-level items |
| `space-btn` | 5px | Right margin between grouped buttons |
| `space-section` | 20px | Top margin on `<hr>` |
| `space-title` | 3px | H1 bottom margin |

### Font Size Scale

| Token | Value | Usage |
|---|---|---|
| `size-xs` | x-small | Page-level action buttons |
| `size-sm` | small | Item controls, info text |
| `size-meta` | smaller | Footer, metadata, secondary labels |

---

## 0. Native Elements (Styled) · `registry:style`

The base layer. Use native HTML directly — no wrappers. Design tokens applied via global CSS. These define the system's ground truth; all components above inherit from here.

---

### `<hr>`

```css
hr {
  border: none;
  border-top: 1px solid var(--border);   /* color-bg-divider */
  margin-top: 20px;                       /* space-section */
  margin-bottom: 0;
}
```

Applied only between major page sections (header / content / footer). Replaced by a sticky parent's top/bottom border when it would scroll away.

---

### `<h1>`, `<h2>`

```css
h1 {
  font-family: var(--font-sans);
  font-weight: bold;
  margin-bottom: 3px;                    /* space-title */
}

h2 {
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: small;                      /* size-sm */
  margin: 0;
}
```

H1 is functional, not decorative — tight margin keeps it out of the way. H2 used for section headings inside collapsible bodies.

---

### `<button>`

```css
button {
  cursor: pointer;
  border: none;
  background: none;
  font-family: var(--font-sans);
  font-size: x-small;                    /* size-xs — page-level default */
  padding: 2px 4px;
  border-radius: 0;
  margin-left: 5px;                      /* space-btn */
}

button:hover   { opacity: 0.8; }
button:focus   { outline: 2px solid var(--primary); outline-offset: 1px; }
button:disabled { opacity: 0.4; cursor: default; }
```

Item control buttons override `font-size` to `small` (size-sm). Unicode symbols preferred as labels: ▶ · ■ · + · −

---

### `<input>`

```css
input {
  border: 1px solid var(--border);       /* color-bg-divider */
  background: var(--card);               /* color-bg-card */
  font-family: var(--font-sans);
  font-size: small;                      /* size-sm */
  padding: 4px 8px;
  border-radius: 0;
  color: inherit;
}

input:hover    { border-color: var(--muted-foreground); }  /* color-neutral */
input:focus    { outline: none; border-color: var(--primary); }
input.error    { border-color: var(--destructive); }
input:disabled { opacity: 0.4; cursor: not-allowed; background: var(--border); }
```

`<input type="checkbox">` keeps browser-native styling — no override. Used as-is for write-gate toggles.

---

### `<label>`

```css
label {
  font-family: var(--font-sans);
  font-size: smaller;                    /* size-meta */
  color: var(--muted-foreground);        /* color-neutral */
  display: block;
  margin-bottom: 4px;
}

/* Inline variant — paired with checkbox */
label.inline {
  display: inline;
  margin-left: 4px;
  margin-bottom: 0;
}
```

Stacked above `<input>` in form contexts. Inline next to `<input type="checkbox">`.

---

### `<textarea>`

```css
textarea {
  border: 1px solid var(--border);
  background: var(--card);
  font-family: var(--font-mono);         /* technical content */
  font-size: small;                      /* size-sm */
  padding: 4px 8px;
  border-radius: 0;
  resize: vertical;
  min-height: 60px;
  color: inherit;
}

textarea:hover  { border-color: var(--muted-foreground); }
textarea:focus  { outline: none; border-color: var(--primary); }
textarea.error  { border-color: var(--destructive); }
```

Always `font-mono` — textareas in this system hold technical values (URLs, config, service addresses).

---

### `<select>`

```css
select {
  border: 1px solid var(--border);
  background: var(--card);
  font-family: var(--font-sans);
  font-size: small;                      /* size-sm */
  padding: 4px 8px;
  border-radius: 0;
  color: inherit;
  cursor: pointer;
}

select:hover  { border-color: var(--muted-foreground); }
select:focus  { outline: none; border-color: var(--primary); }
```

Preferred over shadcn `Select` for small fixed option sets (protocol picker, status filter). Keeps the native dropdown arrow.

---

### `<details>` / `<summary>`

```css
details {
  margin-bottom: 10px;                   /* space-item */
}

details > details {
  margin-left: 14px;                     /* space-indent — per nesting level */
}

summary {
  cursor: pointer;
  user-select: none;
}

summary:focus { outline: 2px solid var(--primary); outline-offset: 2px; }
```

Native disclosure triangle is kept — intentional. No custom icon. Nests arbitrarily deep; each level adds one `space-indent` via the `details > details` rule. `open` attribute controls default state (absent = collapsed, present = expanded).

---

### `<dl>` / `<dt>` / `<dd>`

```css
dl {
  margin: 0;
  margin-left: 14px;                     /* space-indent */
  padding: 0;
}

dt {
  font-family: var(--font-sans);
  font-weight: normal;
  color: inherit;
}

dd {
  margin-left: 0;
  margin-bottom: 2px;
  color: var(--muted-foreground);        /* color-neutral */
  font-size: smaller;                    /* size-meta */
}
```

Primary pattern for key-value data: config entries, metadata, FAQ. `<dd>` may contain an inline `<button>` for actions (e.g., − remove).

---

### `<kbd>`

```css
kbd {
  font-family: var(--font-mono);
  font-size: smaller;                    /* size-meta */
  border: 1px solid var(--muted-foreground);
  background: var(--border);            /* color-bg-divider */
  padding: 1px 4px;
  border-radius: 0;
  display: inline-block;
  line-height: 1.4;
}
```

Used inline in help text, tooltips, or button labels to indicate keyboard shortcuts.

---

## 1. Primitives (shadcn) · `registry:ui`

Shadcn components where the abstraction earns its place — variant systems, accessibility wiring, or controlled state that native HTML doesn't provide cleanly.

---

### Button

Three variants in active use. Layered on top of the styled `<button>` baseline.

| Variant | Token | Usage |
|---|---|---|
| `default` | `color-action` fill | Start, primary CTA |
| `destructive` | `color-danger` fill | Stop, remove |
| `ghost` | none | Add, secondary actions |

- Size: `xs` for page-level, `sm` for item controls
- `--radius: 0`
- Unicode symbols as labels: ▶ · ■ · + · −
- `disabled` reflects item state silently — grayed, no error

---

### Badge

Five semantic variants for process state. Only component with non-zero border radius (3px local override).

| Variant | Color | Label | Style |
|---|---|---|---|
| `default` | `color-success` #10B981 | running | Solid fill, white text |
| `destructive` | `color-danger` | stopped | Solid fill, white text |
| `secondary` | `color-neutral` | completed | Muted fill |
| `outline` | `color-neutral` | disabled | Outline only |
| `secondary` | `color-neutral` | ... | Muted fill |

Font: bold, `size-xs`, `1px 6px` padding, `inline-block`. Always white text on solid variants.

---

### Collapsible

Controlled open/close state management on top of `<details>`/`<summary>`. Use when open state needs to be driven by external data (e.g., status monitoring auto-expands running items).

- `CollapsibleTrigger` → maps to `<summary>`
- `CollapsibleContent` → maps to detail body
- When open state is static (user-controlled only), prefer plain `<details>`

---

### Toggle / ToggleGroup

Accessible binary and multi-select controls. Used for write-gate toggle and status filter bar.

- Size: `sm`
- Active: `color-action` background
- Inactive: `color-bg-divider` background
- `ToggleGroup`: All · Running · Stopped filter bar

---

### Switch

Alternative to `<input type="checkbox">` when binary on/off semantics need to be more visually explicit.

- On: `color-action`
- Off: `color-bg-divider`
- Size: `sm`

---

### Table · `registry:ui` / DataTable · `registry:block`

Dense tabular data with sort/filter. Applied for process lists or config tables when row count justifies it.

- No border radius
- Header: `color-neutral` text, `size-meta`
- Numeric/technical cells: `font-mono`
- Name/label cells: `font-ui`
- Row border: `1px color-bg-divider` between rows only — no outer border
- No row hover highlight
- Zebra striping only when row count > 10

---

### ScrollArea

Wraps long lists that exceed viewport height. Applied at list container level.

- No custom scrollbar styling — system default

---

### Tooltip

Controlled hover overlay for truncated or abbreviated values. Use when content is truncated — never decorative.

- No arrow/caret, `--radius: 0`
- Background: `color-neutral`, white text
- Font: `font-mono`, `size-meta`
- Delay: 400ms

---

## 2. Our Components

Custom components composed from native elements and shadcn primitives. Types vary per component — see annotations below.

---

### StatusBadge · `registry:ui`
**Extends:** `Badge`

Semantic process-state indicator. Five variants: running / stopped / completed / disabled / unknown.

**Props:** `variant: 'running' | 'stopped' | 'completed' | 'disabled' | 'unknown'`, `label?`

---

### MetricsRow · `registry:ui`
**Extends:** styled `<span>` / `<div>`

Single-line monospace stats display below a process summary.

- Font: `font-mono`, `size-meta`, color: `color-neutral`
- Left indent: `space-indent`, top margin: 5px
- Format: `status: X | age: Xs | cpu: X% | mem: XMB`
- Omits fields with no value

**Props:** `status?`, `age?`, `cpu?`, `mem?`

---

### KeyValueList · `registry:ui`
**Extends:** styled `<dl>` / `<dt>` / `<dd>`

Key-value display for config entries, metadata, FAQ content.

- Inherits `<dl>` base styles — `space-indent` left margin, 0 top margin
- `<dd>` may contain inline `<button>` for action (− remove, size-xs, destructive)

**Props:** `items: { key, value, onAction?, actionLabel? }[]`

---

### TreeNode · `registry:ui`
**Extends:** styled `<details>` / `<summary>` or `Collapsible`

Recursive collapsible tree node. Each level adds `space-indent` left margin automatically via `details > details` CSS rule.

- `open`: false (browse) or true (monitoring)
- Trigger line: name + optional StatusBadge
- Use plain `<details>` for static state; use `Collapsible` when open state is data-driven

**Props:** `label`, `open?`, `badge?`, `onToggle?`, `children`

---

### ActionGroup · `registry:ui`
**Extends:** `Button` (multiple)

Horizontal row of control buttons with `space-btn` right margin between each.

| Type | Symbol | Variant |
|---|---|---|
| `start` | ▶ | `default` |
| `stop` | ■ | `destructive` |
| `add` | + | `ghost` |
| `remove` | − | `ghost` |

Size: `sm`. Disabled is silent — grayed only, no error.

**Props:** `actions: { type, label?, onClick, disabled? }[]`

---

### InfoText · `registry:ui`
**Extends:** styled `<div>` / `<span>`

Transient feedback line rendered below a process summary. Shows live op status or error.

- Font: `font-ui`, `size-meta`
- Color: `color-neutral` (grey) normally; `color-danger` (#EF4444) on error
- Left indent: `space-indent`, top margin: 5px
- Content: short human-readable feedback ("starting...", "stopping...") or error message
- No badge on error — color change on the text itself is the signal
- Disappears or resets after op completes

**Props:** `text`, `isError?`

---

### SearchFilterBar · `registry:ui`
**Extends:** styled `<input>`

Text input for filtering visible list items by name in real-time. Placed in the header area.

- Inherits `<input>` base styles: `1px solid color-bg-divider`, no border radius, `font-ui`, `size-sm`
- Placeholder describes target: "Filter processes..." / "Filter tunnels..."
- Filters on `input` event — no submit, no debounce required at typical list sizes
- Focus: `border-color: color-action`

**Props:** `placeholder`, `onFilter`

---

### ProcessCard · `registry:block`
**Extends:** `Card` (adapted) + `StatusBadge` + `MetricsRow` + `InfoText` + `ActionGroup`

Primary unit for a controllable process.

- Trigger: `{name} {StatusBadge}`
- Body: `MetricsRow` → `InfoText` (when active) → `ActionGroup`
- Running: `3px solid color-success` left border + optional `#F0FDF4` background tint
- Stopped/error: neutral border, `InfoText` visible with `color-danger`
- Expanded by default (`open: true`)

**Props:** `name`, `status`, `metrics?`, `info?`, `actions`, `open?`

---

### TunnelEntry · `registry:block`
**Extends:** `TreeNode` + `KeyValueList` + `<button>`

Config-style entry for tunnel proxy management.

- Trigger: tunnel name + optional raw meta text
- Body: `KeyValueList` of hostname → service, each with − remove
- Body footer: + add button
- Collapsed by default (`open: false`)
- `readonly` disables all mutation buttons silently

**Props:** `name`, `meta?`, `entries: { hostname, service }[]`, `onAdd?`, `onRemove?`, `readonly?`

---

### AdminPageHeader · `registry:component`
**Extends:** `<h1>` + `<button>` + `<hr>`

`<h1>` (`space-title` margin) → inline `<button>` actions (`size-xs`) → `<hr>`.

- `stats`: right-aligned summary text, `font-mono`, `size-meta`
- `sticky`: enables StickyHeader behavior

**StickyHeader** (`sticky: true`): `position: sticky; top: 0; background: color-bg-page; border-bottom: 1px solid color-bg-divider` — `<hr>` omitted.

**Props:** `title`, `actions: { label, onClick }[]`, `stats?`, `sticky?`

---

### CollapsibleFooter · `registry:component`
**Extends:** `<details>` / `<summary>` + `KeyValueList` + `<hr>`

Page-level footer. Collapsed by default. Color: `color-neutral`. Font: `size-meta`. Each section renders a `KeyValueList`.

- `sticky`: enables StickyFooter behavior

**StickyFooter** (`sticky: true`): `position: sticky; bottom: 0; background: color-bg-page; border-top: 1px solid color-bg-divider` — `<hr>` omitted. Only use when footer contains actionable content. When both StickyHeader + StickyFooter active, main content needs top + bottom padding.

**Props:** `sections: { title, items: { key, value }[] }[]`, `sticky?`

---

## 3. Additional shadcn Coverages · `registry:ui` (except Command)

Shadcn components requiring structural adaptation to fit the system's flat, native tone.

---

### Card (adapted)
**Use as:** ProcessCard base surface

- No `box-shadow`
- Border: `1px solid color-bg-divider`
- `--radius: 0`
- Running variant: `3px solid color-success` left border, optional `#F0FDF4` background tint

---

### Alert (adapted — inline only)
**Use as:** Inline error / status message

- No icon, `--radius: 0`
- `destructive`: `color-danger` text, no background fill
- `default`: `color-neutral` text, `size-meta`
- Rendered inside its parent component — never floating

---

### Skeleton (adapted)
**Use as:** Initial page load placeholder

- Matches loading component shape (card-height rows)
- No pulse — opacity only
- Color: `color-bg-divider`
- First fetch only; subsequent ops use silent loading lock

---

### Command (adapted) · `registry:block`
**Use as:** Power-user process/tunnel lookup palette

- `--radius: 0`, `font-mono` for result items
- No category icons, keyboard navigation only
- Background: `color-bg-card`, border: `1px solid color-bg-divider`

---

### Field (adapted)
**Use as:** `<label>` + `<input>` + inline error wrapper

- Stacks: `<label>` → `<input>` → error text
- Error: `color-danger`, `size-meta`, inline below input — no icon
- `--radius: 0`

---

### Spinner (adapted — inline only)
**Use as:** In-button loading indicator

- Size: `xs`, inherits Button text color
- Replaces Button label while op runs
- Never standalone

---

### Empty (adapted)
**Use as:** Zero-state for empty lists

- No illustration or icon
- Single line: `color-neutral`, `size-meta`
- e.g., "No tunnels found." / "No processes running."
- Rendered inline where the list would be

---

## 4. Behavioral Patterns · `registry:hook`

Logic that is not visual but defines how every page operates. All three patterns apply together; they are not optional per-component choices.

---

### useWriteGate

Manages readonly/write-mode. Default state: readonly.

- All mutation handlers (`onAdd`, `onRemove`, `onDelete`) check `isReadonly` and return immediately if true — no error, no feedback
- Unlock fires `alert()` with a warning message before granting write access
- UI control: `<input type="checkbox">` (checked = readonly) or `Switch`

**Interface:** `{ isReadonly, unlock(warningMessage) }`

---

### useDestructiveConfirm

Wraps all deletions behind a `prompt()` requiring the user to type the exact target value.

- Returns `true` only on exact string match — caller performs the deletion
- Cancelled silently if input doesn't match or is dismissed
- No boolean "are you sure?" — the typing requirement is the confirmation

**Interface:** `confirm(targetValue, promptMessage?) → boolean`

---

### useLoadingLock

Single boolean lock preventing concurrent async operations page-wide.

- All async actions check `isLoading` before running — silent no-op if locked
- Lock released on completion regardless of success or error
- No spinner or visual indicator during lock — absence of response is the signal
- On completion, view refreshes automatically

**Interface:** `{ isLoading, run(asyncFn) }`

---

## 5. Interaction Patterns

Runtime behaviors that are not tied to a single component. Types vary — see annotations below.

---

### Bulk Actions · `registry:block`

Multi-select for batch start/stop.

- Each list item gains a `<input type="checkbox">` for selection
- When one or more items selected, a bulk action bar appears: "Start All" / "Stop All"
- Bulk actions obey the same disabled states and loading lock as individual actions
- Deselect all hides the bar

---

### Real-time Status Indicators · `registry:style`

Running processes emit a subtle CSS pulse animation on their StatusBadge or left border.

```css
@keyframes pulse-running {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}

.status-running {
  animation: pulse-running 2s ease-in-out infinite;
}
```

- Opacity pulse only — no color flash, no scale change
- Applied to the StatusBadge `running` variant or the card's left border
- Animation stops immediately when process transitions to any non-running state

---

### Error Feedback · `registry:ui`

- Errors surface as `InfoText` with `isError: true` — inline, `color-danger`, no icon
- `console.error` used for unexpected failures
- No user-facing stack traces
- No modals, toasts, or overlays — ever

---

## 6. Do's and Don'ts

- Do use color only for status semantics: blue = action, green = running, red = stopped/error, grey = completed/disabled
- Do use `font-mono` for all technical values (CPU, memory, IDs, ages)
- Do nest `<details>` inside `<details>` for hierarchical data — no depth limit
- Do use native HTML elements as the structural foundation
- Do gate all mutations behind `useWriteGate`; use `useDestructiveConfirm` for deletions; use `useLoadingLock` for all async ops
- Do keep buttons small — they assist, not dominate
- Don't use shadows, gradients, or decorative borders
- Don't use rounded corners except on StatusBadge (3px only)
- Don't mix font sizes beyond the scale: xs / sm / meta / default
- Don't show modals, toasts, or overlays — inline text and native browser dialogs only
- Don't color content that isn't status-bearing — use `color-neutral` for everything secondary
- Don't add spinners or loading overlays — silent lock is the pattern

---

## Excluded

| Component | Reason |
|---|---|
| `Dialog`, `AlertDialog` | Use native `prompt()` / `confirm()` — no modals |
| `Drawer`, `Sheet` | Conflicts with flat, no-overlay rule |
| `Toast`, `Sonner` | Errors are inline — no floating notifications |
| `HoverCard`, `Popover`, `ContextMenu` | Overlay-adjacent — conflicts with minimal tone |
| `DropdownMenu` | Prefer inline `ActionGroup` |
| `Tabs`, `Accordion` | Redundant with `<details>` / `TreeNode` |
| `NavigationMenu`, `Breadcrumb`, `Menubar`, `Sidebar` | Single-page tools only |
| `Calendar`, `DatePicker`, `InputOTP` | Out of scope |
| `Carousel`, `AspectRatio`, `Avatar` | Decorative / not relevant |
| `Slider`, `RadioGroup` | Not in current use cases |
| `Resizable`, `Pagination` | Not in scope |
| `Progress` | Process state is binary — no progress value |
| shadcn `Input`, `Label`, `Textarea`, `Select`, `Checkbox`, `Kbd`, `Separator` | Replaced by styled native HTML elements |
