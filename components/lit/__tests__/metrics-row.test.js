import assert from "node:assert/strict";
import { test } from "node:test";

test("MetricsRow module exports class", async () => {
  const mod = await import("../dist/metrics-row.js");
  assert.ok(mod.MetricsRow, "MetricsRow export must exist");
});
