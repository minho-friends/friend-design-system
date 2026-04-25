import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta: Meta = {
  title: "Components/TunnelEntry",
  render: ({ name, entries, readonly }) =>
    html`<tunnel-entry
      name=${name}
      .entries=${entries}
      .readonly=${readonly}
      .onAdd=${() => console.log("add")}
      .onRemove=${(h: string) => console.log("remove", h)}>
    </tunnel-entry>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    name: "dev-tunnel",
    entries: [
      { hostname: "app.local", service: "localhost:3000" },
      { hostname: "api.local", service: "localhost:4000" },
    ],
    readonly: false,
  },
};

export const Readonly: Story = {
  args: { ...Default.args, readonly: true },
};
