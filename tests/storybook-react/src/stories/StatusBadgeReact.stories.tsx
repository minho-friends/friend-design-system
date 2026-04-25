import { StatusBadgeReact } from "@minho-friends/friend-design-system--react";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "React Components/StatusBadgeReact",
  component: StatusBadgeReact,
  args: {
    variant: "running",
    label: "running",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["running", "stopped", "completed", "disabled", "unknown"],
    },
  },
} satisfies Meta<typeof StatusBadgeReact>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {};
export const Stopped: Story = {
  args: { variant: "stopped", label: "stopped" },
};
