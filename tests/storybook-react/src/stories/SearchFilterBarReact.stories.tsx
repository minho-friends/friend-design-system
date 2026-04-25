import { SearchFilterBarReact } from "@minho-friends/friend-design-system--react";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "React Components/SearchFilterBarReact",
  component: SearchFilterBarReact,
  args: {
    placeholder: "Filter processes...",
  },
} satisfies Meta<typeof SearchFilterBarReact>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
