import type { Preview } from "@storybook/react";
import "../src/styles/globals.css";

import { dystopian } from "@/lib/fonts";
import { withThemeByClassName } from "@storybook/addon-themes";
import { useEffect } from "react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "dark",
    }),
    (storyFn) => {
      useEffect(() => {
        if (typeof document === "undefined") return;
        document?.querySelector("body")?.classList.add(dystopian.variable);
      }, []);

      return storyFn();
    },
  ],
};

export default preview;
