import assert from "node:assert/strict";
import { test } from "node:test";

test("StatusBadge module exports class", async () => {
  const mod = await import("../dist/status-badge.js");
  assert.ok(mod.StatusBadge, "StatusBadge export must exist");
});
