# Requirements: Friend Stream NTFY

## 1. Title & Purpose

**Title:** Friend Stream NTFY
**Subtitle:** Friend Stream NTFY Dashboard
**Purpose:** Dashboard to monitor upcoming scheduled games, manage sent alert states, and send test push notifications via NTFY.

---

## 2. Page Composition

```
1. AdminPageHeader
   - title: "Friend Stream NTFY"
   - actions: [refresh-schedule, reset-alerts]
   - stats: (none)

2. Send Test Alert form
   - label: "Custom Tag:"
   - input: text, id="custom-tag", placeholder="Enter tag name"
   - submit button: "Send Test Alert"

3. Upcoming Games section
   - title: "Next Games (in watch window or upcoming)"
   - content: fetched async from /admin/upcoming, rendered as <pre> JSON

4. Sent Alerts section
   - title: "Sent Alerts"
   - content: server-rendered JSON of alerts array

5. Recent Logs section
   - title: "Recent Logs"
   - content: server-rendered JSON of logs array
```

---

## 3. API Endpoints

```
POST /admin/refresh-schedule
  body: (none)
  → (no body expected; triggers page reload on success)
  Mock: (empty 200 OK)

POST /admin/reset-alerts
  body: (none)
  → (no body expected; triggers page reload on success)
  Mock: (empty 200 OK)

GET  /admin/upcoming
  → ScheduledGame[]
  Mock: [
    { "gameId": "game-001", "homeTeam": "Lions", "awayTeam": "Tigers", "startAt": "2026-04-25T18:00:00Z", "windowStart": "2026-04-25T17:45:00Z", "windowEnd": "2026-04-25T21:00:00Z" },
    { "gameId": "game-002", "homeTeam": "Bears", "awayTeam": "Eagles", "startAt": "2026-04-26T14:00:00Z", "windowStart": "2026-04-26T13:45:00Z", "windowEnd": "2026-04-26T17:00:00Z" }
  ]

POST /api/test-alert
  body: { tag: string }
  → { ok: true } | { error: string }
  Mock (success): { "ok": true }
  Mock (error):   { "error": "tag not found" }
```

---

## 4. Data Models

```
AlertKey:
  string    # opaque key identifying a previously sent alert (e.g. "game-001:Lions:Tigers")

LogEntry:
  timestamp: string   # ISO 8601
  level:     string   # "info" | "warn" | "error"
  message:   string

ScheduledGame:
  gameId:      string
  homeTeam:    string
  awayTeam:    string
  startAt:     string   # ISO 8601
  windowStart: string   # ISO 8601 — start of watch window
  windowEnd:   string   # ISO 8601 — end of watch window

Mock alerts: ["game-001:Lions:Tigers", "game-003:Wolves:Foxes"]

Mock logs: [
  { "timestamp": "2026-04-25T12:00:00Z", "level": "info",  "message": "Schedule refreshed" },
  { "timestamp": "2026-04-25T12:05:00Z", "level": "info",  "message": "Alert sent: game-001" },
  { "timestamp": "2026-04-25T12:06:00Z", "level": "error", "message": "NTFY delivery failed for game-003" }
]
```

---

## 5. Domain Rules & Special Cases

```
- "refresh schedule" calls POST /admin/refresh-schedule then reloads the page
- "reset alerts" calls POST /admin/reset-alerts then reloads the page
- Upcoming games are fetched client-side after page load via fetch('/admin/upcoming')
- Upcoming games are rendered as pretty-printed JSON inside a <pre> block
- Sent Alerts and Recent Logs are server-rendered into the page (not fetched client-side)
- Test alert form: tag must be non-empty; empty tag shows browser alert("Please enter a tag")
- Test alert success: shows alert("Test alert sent successfully!") and clears the input
- Test alert failure: shows alert("Failed to send test alert: " + result.error)
- Test alert network error: shows alert("Error sending test alert: " + error.message)
```

---

## 6. Behavioral Patterns

```
useWriteGate:
  enabled: false
  (all actions are always available)

useDestructiveConfirm:
  enabled: false
  (reset-alerts is immediate with no confirmation dialog)

useLoadingLock:
  enabled: false
  (no shared loading flag; each button acts independently)
```

---

## 7. Copy & Content

```
Page heading:                    "Friend Stream NTFY"
Page heading tooltip:            "Friend Stream NTFY Dashboard"

Refresh schedule button label:   "refresh schedule"
Reset alerts button label:       "reset alerts"

Send test alert section title:   "Send Test Alert"
Custom tag input label:          "Custom Tag:"
Custom tag input placeholder:    "Enter tag name"
Submit button label:             "Send Test Alert"

Upcoming games section title:    "Next Games (in watch window or upcoming)"
Sent alerts section title:       "Sent Alerts"
Recent logs section title:       "Recent Logs"

Empty tag alert:                 "Please enter a tag"
Success alert:                   "Test alert sent successfully!"
Failure alert prefix:            "Failed to send test alert: "
Network error alert prefix:      "Error sending test alert: "
```

---

## 8. External Integrations

```
(none)
```

---

## 9. Footer Sections

```
(none)
```

---

## Checklist

- [x] All API endpoints listed with request + response shapes
- [x] All domain rules that aren't obvious from the UI are written down
- [x] All behavioral patterns configured (or explicitly marked disabled)
- [x] All user-facing strings captured in Copy section
- [x] External integrations listed (none required)
- [x] Page composition matches component names in SPEC.md
