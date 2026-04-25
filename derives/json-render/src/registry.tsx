import { defineRegistry } from "@json-render/react";
import { StackReact } from "@minho-friends/friend-design-system--react";
import { GridReact } from "@minho-friends/friend-design-system--react";
import { CardReact } from "@minho-friends/friend-design-system--react";
import { SeparatorReact } from "@minho-friends/friend-design-system--react";
import { TextReact } from "@minho-friends/friend-design-system--react";
import { HeadingReact } from "@minho-friends/friend-design-system--react";
import { BadgeReact } from "@minho-friends/friend-design-system--react";
import { MetricReact } from "@minho-friends/friend-design-system--react";
import { CalloutReact } from "@minho-friends/friend-design-system--react";
import { StatusBadgeReact } from "@minho-friends/friend-design-system--react";
import { MetricsRowReact } from "@minho-friends/friend-design-system--react";
import { InfoTextReact } from "@minho-friends/friend-design-system--react";
import { KeyValueListReact } from "@minho-friends/friend-design-system--react";
import { SearchFilterBarReact } from "@minho-friends/friend-design-system--react";
import { TreeNodeReact } from "@minho-friends/friend-design-system--react";
import { ActionGroupReact } from "@minho-friends/friend-design-system--react";
import { ProcessCardReact } from "@minho-friends/friend-design-system--react";
import { AdminPageHeaderReact } from "@minho-friends/friend-design-system--react";
import { CollapsibleFooterReact } from "@minho-friends/friend-design-system--react";
import { catalog } from "./catalog.js";

export const { registry } = defineRegistry(catalog as any, {
  actions: {},
  components: {
    // ── Layout ───────────────────────────────────────────────────────────────
    Stack: ({ props, children }: any) => (
      <StackReact direction={props.direction} gap={props.gap} align={props.align}>{children}</StackReact>
    ),
    Grid: ({ props, children }: any) => <GridReact columns={props.columns} gap={props.gap}>{children}</GridReact>,
    Card: ({ props, children }: any) => <CardReact title={props.title} subtitle={props.subtitle}>{children}</CardReact>,
    Separator: () => <SeparatorReact />,
    // ── Text & Display ────────────────────────────────────────────────────────
    Text: ({ props }: any) => <TextReact value={props.value} muted={props.muted} size={props.size} />,
    Heading: ({ props }: any) => <HeadingReact value={props.value} level={props.level} />,
    Badge: ({ props }: any) => <BadgeReact label={props.label} variant={props.variant} />,
    Metric: ({ props }: any) => (
      <MetricReact label={props.label} value={props.value} unit={props.unit} trend={props.trend} />
    ),
    Callout: ({ props }: any) => <CalloutReact message={props.message} variant={props.variant} />,
    // ── Friend Tools Components ───────────────────────────────────────────────
    StatusBadge: ({ props }: any) => <StatusBadgeReact variant={props.variant} label={props.label} />,
    MetricsRow: ({ props }: any) => (
      <MetricsRowReact status={props.status} age={props.age} cpu={props.cpu} mem={props.mem} />
    ),
    InfoText: ({ props }: any) => <InfoTextReact text={props.text} isError={props.isError} />,
    KeyValueList: ({ props }: any) => <KeyValueListReact items={props.items} />,
    SearchFilterBar: ({ props }: any) => <SearchFilterBarReact placeholder={props.placeholder} />,
    TreeNode: ({ props, children }: any) => (
      <TreeNodeReact label={props.label} open={props.open} badge={props.badge} indent={props.indent}>
        {children}
      </TreeNodeReact>
    ),
    ActionGroup: ({ props }: any) => (
      <ActionGroupReact actions={(props.actions ?? []).map((a: any) => ({ ...a, onClick: () => {} }))} />
    ),
    ProcessCard: ({ props, children }: any) => (
      <ProcessCardReact
        name={props.name}
        status={props.status}
        metrics={props.metrics}
        info={props.info}
        infoError={props.infoError}
        open={props.open}
      >
        {children}
      </ProcessCardReact>
    ),
    AdminPageHeader: ({ props }: any) => (
      <AdminPageHeaderReact
        title={props.title}
        stats={props.stats}
        sticky={props.sticky}
        actions={(props.actions ?? []).map((a: any) => ({ ...a, onClick: () => {} }))}
      />
    ),
    CollapsibleFooter: ({ props }: any) => <CollapsibleFooterReact sections={props.sections} sticky={props.sticky} />,
  },
} as any);

export function Fallback({ type }: { type: string }) {
  return (
    <div
      style={{ padding: "8px 12px", background: "#fef3c7", borderRadius: "4px", fontSize: "12px", color: "#92400e" }}
    >
      Unknown component: <code>{type}</code>
    </div>
  );
}
