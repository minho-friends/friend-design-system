import type { Spec } from "@json-render/react";

export const demoSpec: Spec = {
  root: "header",
  elements: {
    "header": {
      type: "AdminPageHeader",
      props: { title: "Friend Tools", stats: "2 running / 3 total", actions: [{ label: "↺ refresh" }] },
    },
    "filter": {
      type: "SearchFilterBar",
      props: { placeholder: "Filter processes..." },
    },
    "card-running": {
      type: "ProcessCard",
      props: { name: "api", status: "running", open: true, info: "healthy" },
      children: ["metrics-1"],
    },
    "metrics-1": {
      type: "MetricsRow",
      props: { status: "running", age: 300, cpu: 5.2, mem: 128 },
    },
    "card-stopped": {
      type: "ProcessCard",
      props: { name: "worker", status: "stopped", open: false, info: "exited with code 0" },
    },
    "card-error": {
      type: "ProcessCard",
      props: { name: "scheduler", status: "stopped", open: true, info: "connection refused", infoError: true },
      children: ["metrics-2"],
    },
    "metrics-2": {
      type: "MetricsRow",
      props: { status: "stopped", age: 0, cpu: 0, mem: 0 },
    },
    "badge-running": {
      type: "StatusBadge",
      props: { variant: "running" },
    },
    "badge-stopped": {
      type: "StatusBadge",
      props: { variant: "stopped" },
    },
    "kv-config": {
      type: "KeyValueList",
      props: {
        items: [
          { key: "version", value: "1.0.0" },
          { key: "env", value: "production" },
        ],
      },
    },
    "footer": {
      type: "CollapsibleFooter",
      props: {
        sections: [
          { title: "System", items: [{ key: "version", value: "1.0.0" }, { key: "uptime", value: "3d 4h" }] },
        ],
      },
    },
  },
};
