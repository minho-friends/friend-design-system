import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta: Meta = {
  title: "Components/MetricsRow",
  render: ({ status, age, cpu, mem }) =>
    html`<metrics-row .status=${status} .age=${age} .cpu=${cpu} .mem=${mem}></metrics-row>`,
  argTypes: {
    status: { control: "text" },
    age: { control: "number" },
    cpu: { control: "number" },
    mem: { control: "number" },
  },
};
export default meta;
type Story = StoryObj;

export const Full: Story = { args: { status: "running", age: 120, cpu: 12.4, mem: 64.2 } };
export const StatusOnly: Story = { args: { status: "stopped" } };
