# Requirements: Friend Stream Restream

## 1. Title & Purpose

**Title:** Friend Stream Restream
**Subtitle:** Friend Stream Restream Dashboard
**Purpose:** Dashboard to start, stop, and monitor restreaming processes managed by process-compose.

---

## 2. Page Composition

```
1. AdminPageHeader
   - title: "Friend Stream Restream"
   - actions: [refresh]
   - stats: (none)

2. (main content)
   - ProcessCard list (one per process, expanded by default)
     - each card shows: name, StatusBadge, MetricsRow, ActionGroup
     - ActionGroup: [▶ start, ▶ start (with URL), ■ stop]

3. CollapsibleFooter
   - sections: [about]
```

---

## 3. API Endpoints

```
GET  /restreams
  → { data: [{ name: string, is_running: boolean, status: string, age: number, cpu: number, mem: number }] }
  Mock: { "data": [
    { "name": "api",        "is_running": true,  "status": "Running",  "age": 3600000000000, "cpu": 0.1,  "mem": 20971520  },
    { "name": "kboglobal1", "is_running": true,  "status": "Running",  "age": 1800000000000, "cpu": 2.5,  "mem": 52428800  },
    { "name": "kboglobal2", "is_running": false, "status": "Stopped",  "age": 0,             "cpu": 0.0,  "mem": 0         }
  ]}

GET  /restream/:name/status
  → { is_running: boolean, status: string, age: number, cpu: number, mem: number }
  | { error: string }
  Mock (name=kboglobal1): { "is_running": true, "status": "Running", "age": 1800000000000, "cpu": 2.5, "mem": 52428800 }
  Mock (error):           { "error": "process not found" }

POST /restream/:name/start
  body: { streamUrl: string } (optional)
  → { ok: true } | { error: string }
  Mock (success): { "ok": true }
  Mock (error):   { "error": "already running" }

POST /restream/:name/stop
  body: (none)
  → { ok: true } | { error: string }
  Mock (success): { "ok": true }
  Mock (error):   { "error": "process not found" }
```

---

## 4. Data Models

```
Process:
  name:       string
  is_running: boolean
  status:     string      # raw status string from process-compose
  age:        number      # nanoseconds since process started
  cpu:        number      # percent (float)
  mem:        number      # bytes
```

---

## 5. Domain Rules & Special Cases

```
- Process list is fetched on page load and re-rendered fully on refresh
- Process list is sorted alphabetically by name (localeCompare)
- All ProcessCards are expanded (open) by default on render
- Status is fetched individually per process after initial render (_updateStatus per card)
- The "api" process cannot be stopped — stop action is disabled unconditionally for name === "api"
- "Start with URL" prompts for a stream URL before starting; cancelled if no input
- After start or stop, _updateStatus is called for that process only (no full re-render)
- MetricsRow format:
    status: {status} | age: {age/1e9 toFixed(1)}s | cpu: {cpu toFixed(1)}% | mem: {mem/1024/1024 toFixed(1)}MB
- Info text shows transient feedback during ops: "starting..." / "stopping..."
- Info text color: grey normally, #EF4444 on error
```

---

## 6. Behavioral Patterns

```
useWriteGate:
  enabled: false
  (no readonly mode — all users can start/stop)

useDestructiveConfirm:
  enabled: false
  (start/stop are not destructive enough to require confirmation)

useLoadingLock:
  enabled: true
  scope: page-level (single shared _loading flag)
  on conflict: silent return (no error shown)
  note: lock is released after each async op regardless of success or error
```

---

## 7. Copy & Content

```
Refresh button label:           "refresh"
Start button label:             "▶ start"
Start with URL button label:    "▶ start (with URL)"
Stop button label:              "■ stop"

Start with URL prompt:          "Enter stream URL for {name}:"

Transient info — starting:      "starting..."
Transient info — stopping:      "stopping..."
```

---

## 8. External Integrations

```
(none)
```

---

## 9. Footer Sections

```
Section: "about"
  What is this?:
    Dashboard to control restreaming processes via process-compose.
  Channels:
    kboglobal1, kboglobal2, ...
  Backend:
    process-compose API at localhost:8080
```

---

## Checklist

- [x] All API endpoints listed with request + response shapes
- [x] All domain rules that aren't obvious from the UI are written down
- [x] All behavioral patterns configured (or explicitly marked disabled)
- [x] All user-facing strings captured in Copy section
- [x] External integrations listed (none required)
- [x] Page composition matches component names in SPEC.md
