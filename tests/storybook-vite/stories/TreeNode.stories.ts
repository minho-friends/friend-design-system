import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta: Meta = {
  title: "Components/TreeNode",
  render: ({ label, open, badge }) =>
    html`<tree-node .label=${label} ?open=${open} .badge=${badge}>
      <p style="margin:4px 0 4px 14px;font-size:smaller">Child content here</p>
    </tree-node>`,
};
export default meta;
type Story = StoryObj;

export const Collapsed: Story = { args: { label: "api", open: false, badge: "stopped" } };
export const Expanded: Story = { args: { label: "worker", open: true, badge: "running" } };
