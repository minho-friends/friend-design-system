"use client";

import { nestedToFlat } from "@json-render/core";
import {
  ActionProvider,
  type ComponentRenderer,
  Renderer,
  type Spec,
  StateProvider,
  VisibilityProvider,
} from "@json-render/react";
import { type ReactNode } from "react";
import { Fallback, registry } from "./chat-registry";

interface ExplorerRendererProps {
  spec: Spec | null;
  loading?: boolean;
}

const fallback: ComponentRenderer = ({ element }) => <Fallback type={element.type} />;

function normalizeSpec(spec: Spec): Spec {
  // If elements is an array (LLM output nested format), convert to flat
  if (Array.isArray((spec as unknown as { elements: unknown[] }).elements)) {
    const arr = (spec as unknown as { elements: unknown[] }).elements;
    if (arr.length > 0) {
      return nestedToFlat(arr[0] as Parameters<typeof nestedToFlat>[0]) as unknown as Spec;
    }
  }
  return spec;
}

export function ExplorerRenderer({
  spec,
  loading,
}: ExplorerRendererProps): ReactNode {
  if (!spec) return null;

  const flatSpec = normalizeSpec(spec);

  return (
    <StateProvider initialState={flatSpec.state ?? {}}>
      <VisibilityProvider>
        <ActionProvider>
          <Renderer
            spec={flatSpec}
            registry={registry}
            fallback={fallback}
            loading={loading}
          />
        </ActionProvider>
      </VisibilityProvider>
    </StateProvider>
  );
}
