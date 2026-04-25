# App Requirements Template

Fill this out per page or per app. Pair with DESIGN.md and SPEC.md to fully specify a renderable output.

---

## 1. Title & Purpose

**Title:** The page `<h1>` text.
**Subtitle / tooltip:** Optional `title` attribute on the heading.
**Purpose:** One sentence — what does this page do and who uses it?

```
Title: Friend Shield
Subtitle: Proxied the Cloudflare Zero Trust Tunnel Dashboard for Friends
Purpose: Lets trusted friends add and remove Cloudflare tunnel proxy entries.
```

---

## 2. Page Composition

List the components in render order. Use component names from SPEC.md.

```
1. AdminPageHeader
   - title: "Friend Shield"
   - actions: [refresh]
   - stats: (none)

2. (main content)
   - TunnelEntry list (one per tunnel, collapsed by default)

3. CollapsibleFooter
   - sections: [cloudflare-defaults, faq]
```

---

## 3. API Endpoints

List every endpoint the page calls. Include method, path, request body shape, and response shape.

```
GET  /shield/_/tunnels
  → [{ id: string, name: string }]

GET  /shield/_/tunnels/:tunnelId
  → [{ hostname: string, service: string }]

POST /shield/_/tunnels/:tunnelId
  body: { hostname: string, service: string }
  → { ok: true } | { message: string, stack: string }

DELETE /shield/_/tunnels/:tunnelId/:hostname
  → { ok: true } | { message: string, stack: string }
```

---

## 4. Data Models

Define the shape of each entity used in the page.

```
Tunnel:
  id: string
  name: string

TunnelConfig:
  hostname: string
  service: string       # format: proto://ip:port (http, https, tcp, ssh, rdp)

Process:
  name: string
  is_running: boolean
  status: string
  age: number           # nanoseconds
  cpu: number           # percent
  mem: number           # bytes
```

---

## 5. Domain Rules & Special Cases

Enumerate any logic that is not derivable from the design system or API contract alone.

```
- Hostname is generated as: {tunnelName}-{keyword}.ucanuse.xyz
  Default keyword suggestion: UUID v4
- Internal IP must be used for service registration (not 127.0.0.1)
  Use 172.17.0.1 for docker host, or internal LAN IP
- The "api" process cannot be stopped (stop action disabled unconditionally)
- Metrics age is in nanoseconds; display as seconds (age / 1e9, 1 decimal)
- Metrics mem is in bytes; display as MB (mem / 1024 / 1024, 1 decimal)
```

---

## 6. Behavioral Patterns

Specify which patterns from SPEC.md apply and configure them.

```
useWriteGate:
  enabled: true
  default: readonly
  unlock warning:
    "BE AWARE!
    You can change the everything you see.
    Your friends are also minho's friends.
    Don't delete the friends' proxies without asking.
    Naming the proxy carefully."

useDestructiveConfirm:
  enabled: true
  prompt template: "Remove {hostname}.\n If yes, write {hostname}."

useLoadingLock:
  enabled: true
  scope: page-level (single shared _loading flag)
```

---

## 7. Copy & Content

Exact strings for prompts, alerts, placeholders, labels, and footer content.

```
Refresh button label: "refresh"
Readonly checkbox label: "readonly?"
Add config prompt: "New domain: {tunnelName}-{}.ucanuse.xyz\nEnter the keyword:"
Service prompt: "New domain: {hostname}\nEnter the service: http://ip:port\n (proto: http, https, tcp, ssh, rdp)"
Service prompt default: "http://192.168.1.1:8000"
Create confirm: "New domain: {hostname}\nNew service: {service}\nOkay to create?"
Unload guard: "dude"
```

---

## 8. External Integrations

List any third-party scripts, libraries, or services the page requires.

```
Sentry:
  sdk: https://browser.sentry-cdn.com/7.17.4/bundle.tracing.min.js
  dsn: https://...@sentry.io/...
  tracesSampleRate: 1.0

uuid:
  import { v4 as uuidv4 } from "https://esm.run/uuid"
  exposed as: window.uuidv4
```

---

## 9. Footer Sections

List each collapsible footer section with its key-value items.

```
Section: "default cloudflare options (ask to change: email or ping to slack)"
  HTTP Host Header (default: ``): Sets the HTTP Host header on requests sent to the local service
  Disabled Chunked Encoding: `false`: Disables chunked transfer encoding. Useful if you are running a WSGI server.
  Connect Timeout: `30` seconds: Timeout for establishing a new TCP connection to your origin server.
  ...

Section: "more questions..."
  0. Inactive?: Proxy daemon was turned off. (maybe). Call @minho or server managers.
  1. Required Login / Restricted Site: (can be set in cloudflare portal manually. ask to @minho.)
  ...
```

---

## Checklist

Before handing this to a generator, verify:

- [ ] All API endpoints listed with request + response shapes
- [ ] All domain rules that aren't obvious from the UI are written down
- [ ] All behavioral patterns configured (or explicitly marked `enabled: false`)
- [ ] All user-facing strings captured in Copy section
- [ ] External integrations listed with exact URLs/versions
- [ ] Page composition matches component names in SPEC.md
