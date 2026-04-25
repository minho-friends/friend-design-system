import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta: Meta = {
  title: "Components/ActionGroup",
  render: ({ actions }) => html`<action-group .actions=${actions}></action-group>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    actions: [
      { type: "start", onClick: () => {}, disabled: false },
      { type: "stop", onClick: () => {}, disabled: true },
      { type: "add", onClick: () => {} },
      { type: "remove", onClick: () => {} },
    ],
  },
};

export const Running: Story = {
  args: {
    actions: [
      { type: "start", onClick: () => {}, disabled: true },
      { type: "stop", onClick: () => {}, disabled: false },
    ],
  },
};
