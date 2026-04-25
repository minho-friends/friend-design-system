import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta: Meta = {
  title: "Components/InfoText",
  render: ({ text, isError }) => html`<info-text .text=${text} .isError=${isError}></info-text>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = { args: { text: "starting...", isError: false } };
export const Error: Story = { args: { text: "connection refused", isError: true } };
