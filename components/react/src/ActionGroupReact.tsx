import { createComponent } from "@lit/react";
import { ActionGroup } from "@minho-friends/friend-design-system--lit";
import React from "react";

export const ActionGroupReact = createComponent({
  tagName: "action-group",
  elementClass: ActionGroup,
  react: React,
});
