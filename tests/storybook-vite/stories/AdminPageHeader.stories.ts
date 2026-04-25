import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta: Meta = {
  title: "Components/AdminPageHeader",
  render: ({ title, stats, sticky, actions }) =>
    html`<admin-page-header
      title=${title}
      .stats=${stats}
      ?sticky=${sticky}
      .actions=${actions}>
    </admin-page-header>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    title: "Friend Tools",
    stats: "3 running / 5 total",
    sticky: false,
    actions: [
      { label: "refresh", onClick: () => {} },
    ],
  },
};

export const Sticky: Story = {
  args: { ...Default.args, sticky: true },
};
