import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const e2eRoot   = resolve(__dirname, "..");
const sampleDir = resolve(e2eRoot, "sample-reqs");
const srcDir    = resolve(e2eRoot, ".build");   // staging for bun input
const outDir    = resolve(e2eRoot, "dist");

if (existsSync(srcDir)) rmSync(srcDir, { recursive: true });
mkdirSync(srcDir, { recursive: true });
mkdirSync(outDir, { recursive: true });

// Bare specifier — resolved by bun from node_modules/
const LIT_PKG = "@minho-friends/friend-design-system--lit";

function parseTitle(md) {
  const m = md.match(/\*\*Title:\*\*\s*(.+)/);
  return m ? m[1].trim() : "Demo";
}

function compositionIncludes(md, name) {
  const m = md.match(/## 2\. Page Composition[\s\S]*?(?=\n## |\n---)/);
  return m ? m[0].includes(name) : false;
}

function wrapHtml(title, body) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; background: #F9FAFB; padding: 20px; max-width: 900px; margin: auto; }
    form { display: flex; gap: 8px; align-items: center; margin: 8px 0; }
    h2   { margin: 20px 0 4px; font-size: 1rem; }
  </style>
</head>
<body>
${body.trim()}
</body>
</html>`;
}

// --- sample 1: Friend Shield ---
function renderFriendShield(title) {
  const mockData = {
    header: { actions: [{ label: "refresh" }] },
    tunnels: [
      { id: "tun-f", name: "comcom-f", entries: [
        { hostname: "comcom-f-myapp.ucanuse.xyz", service: "http://172.17.0.1:8080" },
        { hostname: "comcom-f-api.ucanuse.xyz",   service: "http://172.17.0.1:3000" }
      ]},
      { id: "tun-b", name: "comcom-b", entries: [
        { hostname: "comcom-b-myapp.ucanuse.xyz", service: "http://172.17.0.1:8080" },
        { hostname: "comcom-b-api.ucanuse.xyz",   service: "http://172.17.0.1:3000" }
      ]}
    ],
    footer: { sections: [
      { title: "default cloudflare options", items: [
        { key: "HTTP Host Header",          value: "(default: empty)" },
        { key: "Disabled Chunked Encoding", value: "false" },
        { key: "Connect Timeout",           value: "30 seconds" }
      ]},
      { title: "more questions...", items: [
        { key: "0. Inactive?",                         value: "Proxy daemon was turned off. Call @minho or server managers." },
        { key: "6. Why 127.0.0.1:8000 won't worked?",  value: "Use 172.17.0.1 for docker host or internal LAN IP." }
      ]}
    ]}
  };

  return wrapHtml(title, `
<admin-page-header id="hdr" title="${title}"></admin-page-header>
<tunnel-entry id="tun-f"></tunnel-entry>
<tunnel-entry id="tun-b"></tunnel-entry>
<collapsible-footer id="ftr"></collapsible-footer>

<script type="application/json" id="mock-data">
${JSON.stringify(mockData, null, 2)}
</script>

<script type="module" src="${LIT_PKG}"></script>
<script type="module">
  const { header, tunnels, footer } = JSON.parse(document.getElementById("mock-data").textContent);
  document.getElementById("hdr").actions = header.actions.map(a => ({ label: a.label, onClick: () => location.reload() }));
  for (const t of tunnels) {
    const el = document.getElementById(t.id);
    el.name = t.name; el.entries = t.entries; el.readonly = true;
  }
  document.getElementById("ftr").sections = footer.sections;
</script>`);
}

// --- sample 2: Friend Stream Restream ---
function renderFriendStreamRestream(title) {
  const mockData = {
    header: { actions: [{ label: "refresh" }] },
    processes: [
      { id: "card-api",        name: "api",        status: "running", age: 3600.0, cpu: 0.1, mem: 20.0, canStop: false },
      { id: "card-kboglobal1", name: "kboglobal1", status: "running", age: 1800.0, cpu: 2.5, mem: 50.0, canStop: true  },
      { id: "card-kboglobal2", name: "kboglobal2", status: "stopped", age:    0.0, cpu: 0.0, mem:  0.0, canStop: true  }
    ],
    footer: { sections: [{ title: "about", items: [
      { key: "What is this?", value: "Dashboard to control restreaming processes via process-compose." },
      { key: "Backend",       value: "process-compose API at localhost:8080" }
    ]}]}
  };

  const cards = mockData.processes.map(p => `<process-card id="${p.id}"></process-card>`).join("\n");

  return wrapHtml(title, `
<admin-page-header id="hdr" title="${title}"></admin-page-header>
${cards}
<collapsible-footer id="ftr"></collapsible-footer>

<script type="application/json" id="mock-data">
${JSON.stringify(mockData, null, 2)}
</script>
<script type="module" src="${LIT_PKG}"></script>
<script type="module">
  const { header, processes, footer } = JSON.parse(document.getElementById("mock-data").textContent);
  document.getElementById("hdr").actions = header.actions.map(a => ({ label: a.label, onClick: () => location.reload() }));
  for (const p of processes) {
    const el = document.getElementById(p.id);
    el.name = p.name; el.status = p.status;
    el.metrics = { age: p.age, cpu: p.cpu, mem: p.mem };
    el.actions = [
      { type: "start", disabled: p.status === "running", onClick: () => {} },
      { type: "start", label: "start (with URL)", disabled: p.status === "running", onClick: () => {} },
      { type: "stop",  disabled: !p.canStop || p.status === "stopped", onClick: () => {} }
    ];
  }
  document.getElementById("ftr").sections = footer.sections;
</script>`);
}

// --- sample 3: Friend Stream NTFY ---
function renderFriendStreamNTFY(title) {
  const mockData = {
    header: { actions: [{ label: "refresh schedule" }, { label: "reset alerts" }] },
    upcoming: [
      { key: "Lions vs Tigers", value: "2026-04-25T18:00:00Z (window: 17:45–21:00)" },
      { key: "Bears vs Eagles", value: "2026-04-26T14:00:00Z (window: 13:45–17:00)" }
    ],
    alerts: [
      { key: "game-001", value: "game-001:Lions:Tigers" },
      { key: "game-003", value: "game-003:Wolves:Foxes" }
    ],
    logs: [
      { key: "[info] 2026-04-25T12:00:00Z",  value: "Schedule refreshed" },
      { key: "[info] 2026-04-25T12:05:00Z",  value: "Alert sent: game-001" },
      { key: "[error] 2026-04-25T12:06:00Z", value: "NTFY delivery failed for game-003" }
    ]
  };

  return wrapHtml(title, `
<admin-page-header id="hdr" title="${title}"></admin-page-header>

<h2>Send Test Alert</h2>
<form id="test-alert-form">
  <label for="custom-tag">Custom Tag:</label>
  <input type="text" id="custom-tag" name="custom-tag" placeholder="Enter tag name" />
  <button type="submit">Send Test Alert</button>
</form>
<info-text id="alert-feedback"></info-text>

<h2>Next Games (in watch window or upcoming)</h2>
<key-value-list id="upcoming-list"></key-value-list>

<h2>Sent Alerts</h2>
<key-value-list id="alerts-list"></key-value-list>

<h2>Recent Logs</h2>
<key-value-list id="logs-list"></key-value-list>

<script type="application/json" id="mock-data">
${JSON.stringify(mockData, null, 2)}
</script>

<script type="module" src="${LIT_PKG}"></script>
<script type="module">
  const { header, upcoming, alerts, logs } = JSON.parse(document.getElementById("mock-data").textContent);

  document.getElementById("hdr").actions = header.actions.map(a => ({ label: a.label, onClick: () => {} }));
  document.getElementById("upcoming-list").items = upcoming;
  document.getElementById("alerts-list").items   = alerts;
  document.getElementById("logs-list").items     = logs;

  document.getElementById("test-alert-form").addEventListener("submit", async e => {
    e.preventDefault();
    const tagInput = document.getElementById("custom-tag");
    const feedback = document.getElementById("alert-feedback");
    const tag = tagInput.value.trim();
    if (!tag) { alert("Please enter a tag"); return; }
    try {
      feedback.text = "sending..."; feedback.isError = false;
      const res = await fetch("/api/test-alert", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag })
      });
      const r = await res.json();
      if (r.ok) { feedback.text = "Test alert sent successfully!"; tagInput.value = ""; }
      else { feedback.isError = true; feedback.text = "Failed to send test alert: " + r.error; }
    } catch (err) {
      feedback.isError = true; feedback.text = "Error sending test alert: " + err.message;
    }
  });
</script>`);
}

// --- dispatch ---
const sampleFiles = readdirSync(sampleDir)
  .filter(f => /^sample\d+\.md$/.test(f))
  .sort();

const srcFiles = [];
for (const file of sampleFiles) {
  const md    = readFileSync(resolve(sampleDir, file), "utf8");
  const title = parseTitle(md);
  let html;
  if      (compositionIncludes(md, "TunnelEntry"))  html = renderFriendShield(title);
  else if (compositionIncludes(md, "ProcessCard"))   html = renderFriendStreamRestream(title);
  else                                               html = renderFriendStreamNTFY(title);
  const srcPath = resolve(srcDir, file.replace(".md", ".html"));
  writeFileSync(srcPath, html, "utf8");
  srcFiles.push(srcPath);
}

// Bun bundles everything — resolves "lit" bare specifiers, outputs to dist/
execFileSync("bun", ["build", "--target=browser", ...srcFiles, "--outdir", outDir, "--production", "--"],
  { cwd: e2eRoot, stdio: "inherit" });

console.log("Built:", sampleFiles.map(f => f.replace(".md", ".html")).join(", "));
