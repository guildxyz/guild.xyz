import type { Preview } from "@storybook/react"
import "../src/app/globals.css"
import { dystopian, inter } from "../src/fonts"

import { withThemeByDataAttribute } from "@storybook/addon-themes"

document?.querySelector("body")?.classList.add(inter.variable, dystopian.variable)

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
    withThemeByDataAttribute({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "dark",
      attributeName: "data-theme",
    }),
  ],
}

export default preview
