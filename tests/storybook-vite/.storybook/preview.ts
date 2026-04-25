import type { Preview } from "@storybook/web-components";
import "@minho-friends/friend-design-system--lit";

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        page: { name: "page", value: "#F9FAFB" },
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: "page",
    },
  },
};
export default preview;
