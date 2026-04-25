import assert from "node:assert/strict";
import test from "node:test";

test("StatusBadgeReact module exports a component", async () => {
  const mod = await import("../dist/StatusBadgeReact.js");
  assert.ok(mod.StatusBadgeReact, "StatusBadgeReact export must exist");
});
