"use client";
import { ActionProvider, Renderer, StateProvider, VisibilityProvider } from "@json-render/react";
import type { Spec } from "@json-render/react";
import { registry } from "@minho-friends/friend-design-system--json-render";

export default function DemoRenderer({ spec }: { spec: Spec }) {
  return (
    <StateProvider initialState={{}}>
      <ActionProvider handlers={{}}>
        <VisibilityProvider>
          <Renderer spec={spec} registry={registry as any} />
        </VisibilityProvider>
      </ActionProvider>
    </StateProvider>
  );
}
