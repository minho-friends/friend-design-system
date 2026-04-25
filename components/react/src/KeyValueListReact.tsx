import { createComponent } from "@lit/react";
import { KeyValueList } from "@minho-friends/friend-design-system--lit";
import React from "react";

export const KeyValueListReact = createComponent({
  tagName: "key-value-list",
  elementClass: KeyValueList,
  react: React,
});
