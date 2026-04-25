import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta: Meta = {
  title: "Components/KeyValueList",
  render: ({ items }) => html`<key-value-list .items=${items}></key-value-list>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    items: [
      { key: "host", value: "localhost:3000" },
      { key: "env", value: "production" },
      { key: "pid", value: "1234", actionLabel: "−", onAction: () => {} },
    ],
  },
};
