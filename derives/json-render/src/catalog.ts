import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react";
import { z } from "zod";

const statusVariant = z.enum(["running", "stopped", "completed", "disabled", "unknown"] as const);

export const catalog = defineCatalog(schema, {
  components: {
    // ── Layout ───────────────────────────────────────────────────────────────
    Stack: {
      props: z.object({
        gap: z.string().optional().default("md"),
        direction: z.enum(["vertical", "horizontal"]).optional().default("vertical"),
        align: z.enum(["start", "center", "end", "stretch"]).optional(),
      }) as any,
      description: "Flex container. direction='horizontal' for a row, 'vertical' for a column. gap: sm|md|lg.",
    },
    Grid: {
      props: z.object({
        columns: z.union([z.number(), z.string()]).optional().default(2),
        gap: z.string().optional().default("md"),
      }) as any,
      description: "CSS grid with equal-width columns. columns=2 or columns=3.",
    },
    Card: {
      props: z.object({
        title: z.string().optional(),
        subtitle: z.string().optional(),
      }) as any,
      description: "Bordered card container with optional title and subtitle.",
    },
    Separator: {
      props: z.object({}) as any,
      description: "Horizontal divider line.",
    },
    // ── Text & Display ────────────────────────────────────────────────────────
    Text: {
      props: z.object({
        value: z.string(),
        muted: z.boolean().optional(),
        size: z.enum(["sm", "base", "lg"]).optional().default("base"),
      }) as any,
      description: "Paragraph of text. Use muted=true for secondary text.",
    },
    Heading: {
      props: z.object({
        value: z.string(),
        level: z.number().int().min(1).max(6).optional().default(2),
      }) as any,
      description: "Section heading. level 1-6 (default 2).",
    },
    Badge: {
      props: z.object({
        label: z.string(),
        variant: z.enum(["default", "success", "warning", "error", "info"]).optional().default("default"),
      }) as any,
      description: "Small inline label badge with color variants.",
    },
    Metric: {
      props: z.object({
        label: z.string(),
        value: z.union([z.string(), z.number()]),
        unit: z.string().optional(),
        trend: z.enum(["up", "down", "stable"]).optional(),
      }) as any,
      description: "Key metric display: large value with label.",
    },
    Callout: {
      props: z.object({
        message: z.string(),
        variant: z.enum(["info", "success", "warning", "error"]).optional().default("info"),
      }) as any,
      description: "Callout box for important messages, tips, or warnings.",
    },
    // ── Friend Tools Components ───────────────────────────────────────────────
    StatusBadge: {
      props: z.object({
        variant: statusVariant.default("unknown"),
        label: z.string().optional(),
      }) as any,
      description: "Inline status badge",
    },
    MetricsRow: {
      props: z.object({
        status: z.string().optional(),
        age: z.number().optional(),
        cpu: z.number().optional(),
        mem: z.number().optional(),
      }) as any,
      description: "Monospace metrics row",
    },
    InfoText: {
      props: z.object({
        text: z.string(),
        isError: z.boolean().optional(),
      }) as any,
      description: "Transient feedback line",
    },
    KeyValueList: {
      props: z.object({
        items: z.array(z.object({
          key: z.string(),
          value: z.string(),
          actionLabel: z.string().optional(),
        })).default([]),
      }) as any,
      description: "Key-value dl/dt/dd list",
    },
    SearchFilterBar: {
      props: z.object({
        placeholder: z.string().optional(),
      }) as any,
      description: "Real-time filter input",
    },
    TreeNode: {
      props: z.object({
        label: z.string(),
        open: z.boolean().optional(),
        badge: statusVariant.optional(),
        indent: z.number().optional(),
      }) as any,
      description: "Collapsible tree node",
    },
    ActionGroup: {
      props: z.object({
        actions: z.array(z.object({
          type: z.string(),
          label: z.string().optional(),
          disabled: z.boolean().optional(),
        })).default([]),
      }) as any,
      description: "Horizontal action button row",
    },
    ProcessCard: {
      props: z.object({
        name: z.string(),
        status: statusVariant.default("unknown"),
        info: z.string().optional(),
        infoError: z.boolean().optional(),
        open: z.boolean().optional(),
      }) as any,
      description: "Composite process card",
    },
    AdminPageHeader: {
      props: z.object({
        title: z.string(),
        stats: z.string().optional(),
        sticky: z.boolean().optional(),
        actions: z.array(z.object({ label: z.string() })).default([]),
      }) as any,
      description: "Page header with title and actions",
    },
    CollapsibleFooter: {
      props: z.object({
        sticky: z.boolean().optional(),
        sections: z.array(z.object({
          title: z.string(),
          items: z.array(z.object({ key: z.string(), value: z.string() })),
        })).default([]),
      }) as any,
      description: "Collapsible footer with key-value sections",
    },
  },
} as any);
