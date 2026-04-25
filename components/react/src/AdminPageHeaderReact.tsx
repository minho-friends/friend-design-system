import { createComponent } from "@lit/react";
import { AdminPageHeader } from "@minho-friends/friend-design-system--lit";
import React from "react";

export const AdminPageHeaderReact = createComponent({
  tagName: "admin-page-header",
  elementClass: AdminPageHeader,
  react: React,
});
