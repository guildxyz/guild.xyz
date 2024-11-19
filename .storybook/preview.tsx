import type { Preview } from "@storybook/react";
import { dystopian, inter } from "../src/fonts";
import "../src/app/globals.css";

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
      defaultTheme: "light",
    }),
    (storyFn) => {
      useEffect(() => {
        if (typeof document === "undefined") return;
        document
          ?.querySelector("body")
          ?.classList.add(inter.variable, dystopian.variable);
      }, []);

      return storyFn();
    },
  ],
};

export default preview;
