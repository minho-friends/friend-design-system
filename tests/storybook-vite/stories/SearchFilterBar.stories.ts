import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta: Meta = {
  title: "Components/SearchFilterBar",
  render: ({ placeholder }) =>
    html`<search-filter-bar
      placeholder=${placeholder}
      @filter=${(e: CustomEvent) => console.log("filter:", e.detail)}>
    </search-filter-bar>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = { args: { placeholder: "Filter processes..." } };
