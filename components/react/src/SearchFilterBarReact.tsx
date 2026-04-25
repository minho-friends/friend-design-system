import { createComponent } from "@lit/react";
import { SearchFilterBar } from "@minho-friends/friend-design-system--lit";
import React from "react";

export const SearchFilterBarReact = createComponent({
  tagName: "search-filter-bar",
  elementClass: SearchFilterBar,
  react: React,
  events: { onFilter: "filter" },
});
