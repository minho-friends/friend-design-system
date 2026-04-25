## Overview
Professional, high-density admin dashboard aesthetic for internal tooling. Emphasizes real-time status visibility, scannability, and ease of action. Technical data is displayed in monospaced fonts; UI chrome uses a clean sans-serif. Functional-first with minimal decoration — no gradients, no shadows beyond card surfaces. Designed for trusted operators who need to act quickly and confidently.

## Colors
- **Primary Action** (#2563EB): Start buttons, primary CTAs, active interactive elements
- **Success / Running** (#10B981): Running state badges, active indicators, live process highlights
- **Danger / Stop** (#EF4444): Stop actions, error states, destructive feedback
- **Neutral / Completed** (#6B7280): Completed or disabled states, secondary metadata text
- **Page Background** (#F9FAFB): Base surface
- **Card Background** (#FFFFFF): Process cards, panel surfaces
- **Subtle Divider** (#F3F4F6): Section separators, table row stripes
- **Secondary text** (grey): Footer content, info labels, non-critical metadata

## Typography
- **UI Font** (Headings, Body): Inter or system sans-serif — bold with tight tracking for headings, regular for body
- **Technical Data Font**: JetBrains Mono or Fira Code — used for CPU %, memory, ages, IDs, and any numeric/technical values
- **Label Font**: Inter or system sans-serif

Buttons use `x-small` font size. Item controls use `small`. Footer/metadata uses `smaller`.
Technical inline values (stats rows, terminal output) always use the monospace font for alignment.
Bold weight is reserved for headings and status badge labels only.

## Elevation
No decorative shadows. Cards have a subtle `1px` border (`#F3F4F6`) to separate from the page background.
Running cards gain a faint colored left border or background tint to signal active state without adding visual noise.
Hierarchy is conveyed through left margin offsets (14px indent per nesting level) and `<hr>` dividers with 20px top margin.
Tree depth is expressed by nested `<details>` inside `<details>` — each level adds 14px left margin, no additional visual treatment needed.

## Layout
- **Header**: Persistent top bar containing: page title, global Refresh button, global stats summary (total running / total processes)
- **Main content**: Responsive grid or list of Process Cards
- **Footer/Sidebar**: Collapsible system info section (about, API details, architectural context)
- H1 uses tight bottom margin (3px) — page title is functional, not decorative
- Top-level items have `10px` bottom margin between them
- Horizontal button groups use `5px` right margin between buttons
- Nested content indented `14px` from parent at every level
- `<hr>` with `20px` top margin separates major page sections

## Components

### Details/Summary Tree
The primary structure for all hierarchical content. Nests arbitrarily deep — details inside details inside details. Each nesting level adds 14px left margin. `cursor: pointer` on summary.

- **Collapsed by default**: browsing and list views (user expands on demand)
- **Expanded by default** (`open` attribute): monitoring and status views (all items visible at load)
- Summary line contains: item name, followed by inline status badge if applicable
- Child content sits directly inside the details element, indented by the parent's margin

### Process Card
The primary unit for displaying a manageable process or channel.

- **Header row**: Process name (monospace or bold sans-serif), Status Badge, expand/collapse toggle
- **Stats row**: Age, CPU %, Memory — displayed in a single monospaced line (`font-family: monospace`, `font-size: smaller`, `color: grey`)
- **Action group**: Start (primary blue), Start with URL (outline/secondary), Stop (danger outline) — horizontally grouped, `5px` right margin between
- **State styling**: Running cards get a faint left border (`3px solid #10B981`) or `#F0FDF4` background tint. Stopped/error cards may use a neutral or red tint.
- **Disabled button state**: Start disabled when running; Stop disabled when stopped. Silent, no error.

### Buttons
No border radius on page-level buttons. Minimal footprint. Never dominant.

- **Page-level actions** (Refresh, Submit): `x-small` font, `5px` left margin, placed inline near heading or in header bar
- **Item controls** (Start, Stop, Add, Remove): `small` font, `5px` right margin, grouped horizontally in a `.controls` div
- **Unicode symbols** for action verbs: ▶ start, ■ stop, + add, − remove
- **Disabled state**: reflects current item state (start disabled when running, stop disabled when stopped). No error shown — silent no-op.

### Status Badges
Inline span appended to summary text. `3px` border-radius, `x-small` font, bold, `1px 6px` padding, `inline-block`, white text always.

| State     | Color   | Text       | Style          |
|-----------|---------|------------|----------------|
| Running   | #10B981 | running    | Solid fill     |
| Stopped   | #EF4444 | stopped    | Solid fill     |
| Completed | #6B7280 | completed  | Subtle gray    |
| Disabled  | #6B7280 | disabled   | Muted/outline  |
| Unknown   | #6B7280 | ...        | Solid fill     |

### Info / Status Text
Secondary line below summary, inside the details element.

- `grey` color, `smaller` font, `14px` left indent, `5px` top margin
- Turns `#EF4444` on error — no badge, just color change on the text itself
- Content: live metrics (status, age, cpu, mem) or short human-readable feedback ("starting...", "stopping...")
- Technical values (CPU %, mem, age) use monospace font inline

### Search / Filter Bar
A text input in the header area for filtering visible items by name. Filters in real-time without a submit action. Placeholder text describes what's being searched (e.g., "Filter processes..."). No border radius; `1px` border; matches the page's flat aesthetic.

### DL/DT/DD Lists
Key-value display for config, metadata, and FAQ content.

- `14px` left margin, `0` top margin
- `<dt>` is the key (plain text, no styling)
- `<dd>` is the value; may contain an inline action button (e.g., − delete)
- Used inside details for on-demand expansion of config/info

### HR Dividers
Plain `<hr>` with `margin-top: 20px`. Separates: header area, main content, footer. No other use.

### Footer
`<details>` element, collapsed by default. `color: grey`. `font-size: smaller`.
Contains DL/DT/DD lists for reference info (default config values, FAQ, about, API details).
Contact/link info goes here, not in the main content area.

## Interaction

### Readonly / Write-mode Gating
All mutation actions (add, delete, edit) are disabled by default in readonly mode.
A checkbox or toggle unlocks write mode. On unlock, an `alert()` warns the user of consequences before granting access.
In readonly mode, mutation handlers return immediately — no error, no visual feedback.

### Destructive Confirmation
Deletions require the user to type the exact target value (e.g., hostname, process name) into a `prompt()` dialog.
If the typed value doesn't match exactly, the action is cancelled silently.
No "are you sure?" boolean confirm — the typing requirement is the confirmation.

### Bulk Actions
A selection mechanism (checkboxes on each item) enables multi-select. A bulk action bar appears when one or more items are selected, offering Start All / Stop All. Bulk actions apply the same logic as individual actions (disabled states, loading lock).

### Loading State
A single boolean `_loading` flag prevents concurrent operations.
While loading, all action triggers return immediately (silent no-op).
No spinner or visual indicator — the absence of response is the signal.
On completion, the view refreshes automatically.

### Real-time Status Indicators
Running processes show a subtle CSS pulse animation on their status badge or left border to signal active monitoring.
Animation is subtle — opacity or scale pulse, not color flash. Stops immediately when process stops.

### Error Feedback
Errors surface as inline text (info/status line) in `#EF4444`, not as modals or toasts.
`console.error` used for unexpected failures. No user-facing stack traces.

## Do's and Don'ts
- Do use color only for status semantics (blue = action, green = running, red = stopped/error, grey = completed/disabled)
- Do keep buttons small and out of the way — they assist, not dominate
- Do use native HTML elements (details, dl, hr) instead of custom components where possible
- Do nest details inside details to represent tree hierarchies — no limit on depth
- Do use monospace font for all technical values (CPU, memory, IDs, ages)
- Don't use decorative shadows — card depth via border only
- Don't mix font sizes beyond the established scale (x-small / small / smaller / default)
- Don't use rounded corners on buttons or containers — only status badges get 3px radius
- Don't add color to content that isn't status-bearing — use grey for everything secondary
- Don't show modals, toasts, or overlays — use inline text and native browser dialogs only
