# Requirements: Friend Shield

## 1. Title & Purpose

**Title:** Friend Shield
**Subtitle:** Proxied the Cloudflare Zero Trust Tunnel Dashboard for Friends
**Purpose:** Lets trusted friends view, add, and remove Cloudflare Zero Trust tunnel proxy entries across shared infrastructure.

---

## 2. Page Composition

```
1. AdminPageHeader
   - title: "Friend Shield"
   - actions: [refresh]
   - extras: readonly checkbox (inline, after refresh button)
   - stats: (none)

2. (main content)
   - TunnelEntry list (one per tunnel, collapsed by default)
     - each tunnel expands to show TunnelConfig KeyValueList
     - each config entry has a − remove button
     - bottom of expanded tunnel: + add config button

3. CollapsibleFooter
   - sections: [cloudflare-defaults, faq]
```

---

## 3. API Endpoints

```
GET  /shield/_/tunnels
  → [{ id: string, name: string }]
  sorted by name descending
  Mock: [
    { "id": "def456", "name": "comcom-f" },
    { "id": "abc123", "name": "comcom-b" }
  ]

GET  /shield/_/tunnels/:tunnelId
  → [{ hostname: string, service: string }]
  sorted by hostname descending
  Mock (tunnelId=abc123): [
    { "hostname": "comcom-b-myapp.ucanuse.xyz",  "service": "http://172.17.0.1:8080" },
    { "hostname": "comcom-b-api.ucanuse.xyz",    "service": "http://172.17.0.1:3000" }
  ]

POST /shield/_/tunnels/:tunnelId
  body: { hostname: string, service: string }
  → { ok: true } | { message: string, stack: string }
  Mock (success): { "ok": true }
  Mock (error):   { "message": "hostname already exists", "stack": "Error: hostname already exists\n    at ..." }

DELETE /shield/_/tunnels/:tunnelId/:hostname
  → { ok: true } | { message: string, stack: string }
  Mock (success): { "ok": true }
  Mock (error):   { "message": "tunnel not found", "stack": "Error: tunnel not found\n    at ..." }
```

---

## 4. Data Models

```
Tunnel:
  id: string
  name: string

TunnelConfig:
  hostname: string
  service: string     # format: proto://ip:port
                      # allowed protos: http, https, tcp, ssh, rdp
```

---

## 5. Domain Rules & Special Cases

```
- Hostname is generated as: {tunnelName}-{keyword}.ucanuse.xyz
  Default keyword suggestion: UUID v4 (window.uuidv4())
- Do NOT use 127.0.0.1 for service IP inside docker; use 172.17.0.1 or internal LAN IP
- Tunnel list is fetched once on page load via _showTunnels()
- TunnelConfig list is fetched lazily on <details> toggle (not on page load)
- If <details> is readonly and already has child nodes, toggle is a no-op (no re-fetch)
- After any create or delete, clear and re-render the full tunnel list
- window.onbeforeunload returns "dude" to warn on accidental navigation
```

---

## 6. Behavioral Patterns

```
useWriteGate:
  enabled: true
  default: readonly (checkbox checked)
  unlock warning:
    "BE AWARE!
    You can change the everything you see.
    Your friends are also minho's friends.
    Don't delete the friends' proxies without asking.
    Naming the proxy carefully."

useDestructiveConfirm:
  enabled: true
  trigger: delete config entry
  prompt template: "Remove {hostname}.\n If yes, write {hostname}."
  match: exact string equality

useLoadingLock:
  enabled: true
  scope: page-level (single shared _loading flag)
  on conflict: silent return (no error shown)
```

---

## 7. Copy & Content

```
Refresh button label:        "refresh"
Readonly checkbox label:     "readonly?"
Readonly checkbox default:   checked (readonly mode on load)

Add config keyword prompt:   "New domain: {tunnelName}-{}.ucanuse.xyz\nEnter the keyword:"
Add config keyword default:  uuidv4()

Add config service prompt:   "New domain: {hostname}\nEnter the service: http://ip:port\n (proto: http, https, tcp, ssh, rdp)"
Add config service default:  "http://192.168.1.1:8000"

Create confirm dialog:       "New domain: {hostname}\nNew service: {service}\nOkay to create?"

Remove button label:         "-"
Add button label:            "+"

Unload guard message:        "dude"
```

---

## 8. External Integrations

```
uuid:
  import: { v4 as uuidv4 } from "https://esm.run/uuid"
  exposed as: window.uuidv4
```

---

## 9. Footer Sections

```
Section: "default cloudflare options (ask to change: minhoryang+friendshield@gmail.com or ping to slack)"
  HTTP Host Header (default: ``):
    Sets the HTTP Host header on requests sent to the local service
  Disabled Chunked Encoding: `false`:
    Disables chunked transfer encoding. Useful if you are running a WSGI server.
  Connect Timeout: `30` seconds:
    Timeout for establishing a new TCP connection to your origin server.
    This excludes the time taken to establish TLS, which is controlled by tlsTimeout.
  Proxy Type: ``:
    cloudflared starts a proxy server to translate HTTP traffic into TCP when proxying,
    for example, SSH or RDP. Valid options: "" for regular proxy, "socks" for SOCKS5 proxy.
  Idle Connection Expiration Time: ``:
    Timeout after which an idle keepalive connection can be discarded.
  Keep Alive Connections: `100` maximum:
    Maximum number of idle keepalive connections between Tunnel and your origin.
    This does not restrict the total number of concurrent connections.
  TCP Keep Alive Interval: `30` seconds:
    The timeout after which a TCP keepalive packet is sent on a connection between Tunnel and the origin server.

Section: "more questions..."
  0. Inactive?:
    Proxy daemon was turned off. (maybe). Call @minho or server managers. or https://www.cloudflarestatus.com/
  1. Required Login / Restricted Site only for Friends or Specific Users or Specific IP Range, CURL-only-ip-range:
    (can be set in cloudflare portal manually. ask to @minho.)
  2. Additional Proxy Point (Prefix):
    (can be set in cloudflare portal manually. ask to @minho.)
  3. How to use TCP/SSH Proxy:
    https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/use_cases/ssh/#connect-to-ssh-server-with-cloudflared-access
  4. Logging on proxy? How to debug?:
    THERE ARE NO LOGGING ON PROXY, only for admin dashboard.
  5. Permissions of dashboard?:
    All my friends can add/delete the records of approved domains/proxies. Be aware before your click.
  6. Why 127.0.0.1:8000 won't worked?:
    Our proxy daemon was running inside of docker container, so use 172.17.0.1 for same purpose.
    But mostly, on each edge (comcom-b, comcom-f, ...) there are at least 2 proxy daemon with different nodes.
    So PLEASE USE INTERNAL IP for registering the proxy.
  7. APIs?:
    Check this page's code. and add your server as BYPASS_AUTH_VIA_CURL-only-ip-range. Bon appetit :)
  8. Codebase:
    https://github.com/minho-friends/friend-shield-tunnel (ask @minho to add yourself as a friend) Contributions are welcoming.
```

---

## Checklist

- [x] All API endpoints listed with request + response shapes
- [x] All domain rules that aren't obvious from the UI are written down
- [x] All behavioral patterns configured
- [x] All user-facing strings captured in Copy section
- [x] External integrations listed with exact URLs/versions
- [x] Page composition matches component names in SPEC.md
