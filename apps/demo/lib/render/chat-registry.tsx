"use client";

import { defineRegistry } from "@json-render/react";
import { Fallback as FallbackBase } from "@minho-friends/friend-design-system--json-render";
import { chatCatalog } from "./chat-catalog";

import {
  ActionGroupReact,
  AdminPageHeaderReact,
  BadgeReact,
  CalloutReact,
  CardReact,
  CollapsibleFooterReact,
  GridReact,
  HeadingReact,
  InfoTextReact,
  KeyValueListReact,
  MetricReact,
  MetricsRowReact,
  ProcessCardReact,
  SearchFilterBarReact,
  SeparatorReact,
  StackReact,
  StatusBadgeReact,
  TextReact,
  TreeNodeReact,
} from "@minho-friends/friend-design-system--react";

export const { registry } = defineRegistry(chatCatalog as any, {
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

export { FallbackBase as Fallback };
