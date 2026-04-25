import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta: Meta = {
  title: "Components/ProcessCard",
  render: ({ name, status, metrics, open }) =>
    html`<process-card
      .name=${name}
      .status=${status}
      .metrics=${metrics}
      .actions=${[
      { type: "start", onClick: () => {}, disabled: status === "running" },
      { type: "stop", onClick: () => {}, disabled: status !== "running" },
    ]}
      ?open=${open}
    ></process-card>`,
};
export default meta;
type Story = StoryObj;

export const Running: Story = {
  args: { name: "api", status: "running", metrics: { age: 300, cpu: 5.2, mem: 128 }, open: true },
};
export const Stopped: Story = {
  args: { name: "worker", status: "stopped", metrics: { age: 0 }, open: false },
};
