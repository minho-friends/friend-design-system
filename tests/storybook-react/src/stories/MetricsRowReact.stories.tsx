import { MetricsRowReact } from "@minho-friends/friend-design-system--react";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "React Components/MetricsRowReact",
  component: MetricsRowReact,
  args: {
    status: "running",
    age: 300,
    cpu: 5.2,
    mem: 128,
  },
} satisfies Meta<typeof MetricsRowReact>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
