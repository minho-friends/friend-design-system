import { createComponent } from "@lit/react";
import { StatusBadge } from "@minho-friends/friend-design-system--lit";
import React from "react";

export const StatusBadgeReact = createComponent({
  tagName: "status-badge",
  elementClass: StatusBadge,
  react: React,
});
