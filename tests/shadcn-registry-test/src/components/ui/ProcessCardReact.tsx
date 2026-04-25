import { createComponent } from "@lit/react";
import { ProcessCard } from "@minho-friends/friend-design-system--lit";
import React from "react";

export const ProcessCardReact = createComponent({
  tagName: "process-card",
  elementClass: ProcessCard,
  react: React,
});
