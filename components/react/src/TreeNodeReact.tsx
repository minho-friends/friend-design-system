import { createComponent } from "@lit/react";
import { TreeNode } from "@minho-friends/friend-design-system--lit";
import React from "react";

export const TreeNodeReact = createComponent({
  tagName: "tree-node",
  elementClass: TreeNode,
  react: React,
  events: { onToggle: "toggle" },
});
