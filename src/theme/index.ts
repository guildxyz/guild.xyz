import { extendTheme, ThemeConfig } from "@chakra-ui/react"
import colors from "./colors"
import components from "./components"
import styles from "./styles"

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors,
  space: {
    11: "2.75rem",
  },
  fonts: {
    body: "var(--font-inter)",
    heading: "var(--font-inter)",
    display: "var(--font-dystopian)",
  },
  shadows: {
    outline: "0 0 0 4px rgba(170, 170, 170, 0.6)",
  },
  components,
  styles,
})

export default theme
