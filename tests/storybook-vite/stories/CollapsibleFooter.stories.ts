import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta: Meta = {
  title: "Components/CollapsibleFooter",
  render: ({ sections, sticky }) =>
    html`<collapsible-footer .sections=${sections} ?sticky=${sticky}></collapsible-footer>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    sticky: false,
    sections: [
      {
        title: "Config",
        items: [
          { key: "version", value: "1.0.0" },
          { key: "env", value: "production" },
        ],
      },
      {
        title: "API",
        items: [
          { key: "endpoint", value: "http://localhost:8080" },
        ],
      },
    ],
  },
};
