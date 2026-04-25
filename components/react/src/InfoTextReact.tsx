import { createComponent } from "@lit/react";
import { InfoText } from "@minho-friends/friend-design-system--lit";
import React from "react";

export const InfoTextReact = createComponent({
  tagName: "info-text",
  elementClass: InfoText,
  react: React,
});
