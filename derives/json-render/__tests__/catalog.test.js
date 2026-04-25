import assert from "node:assert/strict";
import test from "node:test";

test("catalog exports known component names", async () => {
  const { catalog } = await import("../dist/catalog.js");
  const names = catalog.componentNames;
  assert.ok(names.includes("StatusBadge"), "StatusBadge must be in catalog");
  assert.ok(names.includes("MetricsRow"), "MetricsRow must be in catalog");
  assert.ok(names.includes("ProcessCard"), "ProcessCard must be in catalog");
});
