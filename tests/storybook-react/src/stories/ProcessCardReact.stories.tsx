import { ProcessCardReact } from "@minho-friends/friend-design-system--react";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "React Components/ProcessCardReact",
  component: ProcessCardReact,
  render: ({ status, ...args }) => (
    <ProcessCardReact
      {...args}
      status={status}
      actions={[
        { type: "start", onClick: () => {}, disabled: status === "running" },
        { type: "stop", onClick: () => {}, disabled: status !== "running" },
      ]}
    />
  ),
  args: {
    name: "api",
    status: "running",
    metrics: { age: 300, cpu: 5.2, mem: 128 },
    open: true,
  },
} satisfies Meta<typeof ProcessCardReact>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {};
export const Stopped: Story = {
  args: {
    name: "worker",
    status: "stopped",
    metrics: { age: 0 },
    open: false,
  },
};
