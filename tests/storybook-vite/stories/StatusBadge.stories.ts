import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta: Meta = {
  title: "Components/StatusBadge",
  render: ({ variant, label }) => html`<status-badge .variant=${variant} .label=${label}></status-badge>`,
  argTypes: {
    variant: {
      control: "select",
      options: ["running", "stopped", "completed", "disabled", "unknown"],
    },
    label: { control: "text" },
  },
};
export default meta;
type Story = StoryObj;

export const Running: Story = { args: { variant: "running", label: "running" } };
export const Stopped: Story = { args: { variant: "stopped", label: "stopped" } };
export const Completed: Story = { args: { variant: "completed", label: "completed" } };
export const Disabled: Story = { args: { variant: "disabled", label: "disabled" } };
export const Unknown: Story = { args: { variant: "unknown", label: "..." } };
