import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = (name) => resolve(__dirname, "..", "dist", name);

// Clean previous outputs, then run the build once for all tests
for (const f of ["sample1.html", "sample2.html", "sample3.html"]) {
  if (existsSync(dist(f))) rmSync(dist(f));
}
await import("../scripts/build.js");

const html = (name) => readFileSync(dist(name), "utf8");

// Parse the <script type="application/json" id="mock-data"> block from a dist HTML file.
// This block is preserved by bun (not bundled as JS) and contains all mock values.
function parseMockData(name) {
  const m = html(name).match(/<script type="application\/json" id="mock-data">([\s\S]*?)<\/script>/);
  assert.ok(m, `${name} must contain a mock-data JSON block`);
  return JSON.parse(m[1]);
}

// --- global ---

test("build produces all three sample HTML files", () => {
  assert.ok(existsSync(dist("sample1.html")), "sample1.html must exist");
  assert.ok(existsSync(dist("sample2.html")), "sample2.html must exist");
  assert.ok(existsSync(dist("sample3.html")), "sample3.html must exist");
});

test("all samples are valid HTML with a <title>", () => {
  for (const name of ["sample1.html", "sample2.html", "sample3.html"]) {
    const c = html(name);
    assert.ok(c.startsWith("<!doctype html>"), `${name} must start with doctype`);
    assert.ok(c.includes("<title>"), `${name} must include <title>`);
  }
});

test("all samples embed a mock-data JSON block", () => {
  for (const name of ["sample1.html", "sample2.html", "sample3.html"]) {
    assert.ok(html(name).includes('"mock-data"'), `${name} must have mock-data block`);
  }
});

test("all samples include admin-page-header", () => {
  for (const name of ["sample1.html", "sample2.html", "sample3.html"]) {
    assert.ok(html(name).includes("admin-page-header"), `${name} must include admin-page-header`);
  }
});

// --- sample1: Friend Shield ---

test("sample1.html — title is Friend Shield", () => {
  assert.ok(html("sample1.html").includes("<title>Friend Shield</title>"));
});

test("sample1.html — renders tunnel-entry components", () => {
  const c = html("sample1.html");
  assert.ok(c.includes("tunnel-entry"), "must include tunnel-entry");
  assert.ok(c.includes("collapsible-footer"), "must include collapsible-footer");
});

test("sample1.html — mock data contains both tunnels", () => {
  const data = parseMockData("sample1.html");
  const names = data.tunnels.map(t => t.name);
  assert.ok(names.includes("comcom-b"), "must have comcom-b tunnel");
  assert.ok(names.includes("comcom-f"), "must have comcom-f tunnel");
});

test("sample1.html — mock tunnel entries have docker host IP", () => {
  const data = parseMockData("sample1.html");
  const allServices = data.tunnels.flatMap(t => t.entries.map(e => e.service));
  assert.ok(allServices.some(s => s.includes("172.17.0.1")), "must use docker host IP");
});

// --- sample2: Friend Stream Restream ---

test("sample2.html — title is Friend Stream Restream", () => {
  assert.ok(html("sample2.html").includes("<title>Friend Stream Restream</title>"));
});

test("sample2.html — renders process-card for each mock process", () => {
  const c = html("sample2.html");
  assert.ok(c.includes("process-card"), "must include process-card");
  assert.ok(c.includes("card-api"), "must include api card");
  assert.ok(c.includes("card-kboglobal1"), "must include kboglobal1 card");
  assert.ok(c.includes("card-kboglobal2"), "must include kboglobal2 card");
  assert.ok(c.includes("collapsible-footer"), "must include collapsible-footer");
});

test("sample2.html — mock data contains all three processes", () => {
  const data = parseMockData("sample2.html");
  const names = data.processes.map(p => p.name);
  assert.ok(names.includes("api"),        "must have api process");
  assert.ok(names.includes("kboglobal1"), "must have kboglobal1 process");
  assert.ok(names.includes("kboglobal2"), "must have kboglobal2 process");
});

test("sample2.html — api process canStop is false", () => {
  const data = parseMockData("sample2.html");
  const api = data.processes.find(p => p.name === "api");
  assert.ok(api, "api process must exist in mock data");
  assert.equal(api.canStop, false, "api canStop must be false");
});

test("sample2.html — non-api processes have canStop true", () => {
  const data = parseMockData("sample2.html");
  for (const p of data.processes.filter(p => p.name !== "api")) {
    assert.equal(p.canStop, true, `${p.name} canStop must be true`);
  }
});

// --- sample3: Friend Stream NTFY ---

test("sample3.html — title is Friend Stream NTFY", () => {
  assert.ok(html("sample3.html").includes("<title>Friend Stream NTFY</title>"));
});

test("sample3.html — uses key-value-list and info-text lit components", () => {
  const c = html("sample3.html");
  assert.ok(c.includes("key-value-list"), "must include key-value-list");
  assert.ok(c.includes("info-text"),      "must include info-text");
});

test("sample3.html — includes test alert form", () => {
  const c = html("sample3.html");
  assert.ok(c.includes("test-alert-form"), "must include test-alert-form");
  assert.ok(c.includes("custom-tag"),      "must include custom-tag input");
  assert.ok(c.includes("Send Test Alert"), "must include submit button label");
});

test("sample3.html — header actions in mock data", () => {
  const data = parseMockData("sample3.html");
  const labels = data.header.actions.map(a => a.label);
  assert.ok(labels.includes("refresh schedule"), "must have refresh schedule action");
  assert.ok(labels.includes("reset alerts"),     "must have reset alerts action");
});

test("sample3.html — mock upcoming games are embedded", () => {
  const data = parseMockData("sample3.html");
  const keys = data.upcoming.map(g => g.key);
  assert.ok(keys.some(k => k.includes("Lions")),  "must include Lions game");
  assert.ok(keys.some(k => k.includes("Bears")),  "must include Bears game");
});

test("sample3.html — mock sent alerts are embedded", () => {
  const data = parseMockData("sample3.html");
  const values = data.alerts.map(a => a.value);
  assert.ok(values.includes("game-001:Lions:Tigers"), "must include game-001 alert");
  assert.ok(values.includes("game-003:Wolves:Foxes"), "must include game-003 alert");
});

test("sample3.html — mock logs are embedded", () => {
  const data = parseMockData("sample3.html");
  const msgs = data.logs.map(l => l.value);
  assert.ok(msgs.some(m => m.includes("Schedule refreshed")),   "must include refresh log");
  assert.ok(msgs.some(m => m.includes("NTFY delivery failed")), "must include error log");
});
