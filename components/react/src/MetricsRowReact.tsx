import { createComponent } from "@lit/react";
import { MetricsRow } from "@minho-friends/friend-design-system--lit";
import React from "react";

export const MetricsRowReact = createComponent({
  tagName: "metrics-row",
  elementClass: MetricsRow,
  react: React,
});
