import { createComponent } from "@lit/react";
import { TunnelEntry } from "@minho-friends/friend-design-system--lit";
import React from "react";

export const TunnelEntryReact = createComponent({
  tagName: "tunnel-entry",
  elementClass: TunnelEntry,
  react: React,
});
