import { extendTheme, ThemeConfig } from "@chakra-ui/react"
import colors from "./colors"
import components from "./components"
import styles from "./styles"

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors,
  space: {
    11: "2.75rem",
  },
  fonts: {
    body: "Inter var, Inter, sans-serif",
    heading: "Inter var, Inter, sans-serif",
    display: "Dystopian, sans-serif",
  },
  shadows: {
    outline: "0 0 0 4px rgba(170, 170, 170, 0.6)",
  },
  components,
  styles,
})

export default theme
