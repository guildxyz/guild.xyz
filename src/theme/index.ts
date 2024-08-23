import { ThemeConfig, extendTheme } from "@chakra-ui/react"
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
    body: "var(--font-inter), sans-serif",
    heading: "var(--font-inter), sans-serif",
    display: "var(--font-dystopian), sans-serif",
  },
  shadows: {
    outline: "0 0 0 4px rgba(170, 170, 170, 0.6)",
  },
  components,
  styles,
  breakpoints: {
    // needed for the Tailwind migration, matches Tailwind's sm breakpoint (and is between Chakra's sm and md)
    smd: "640px",
  },
})

export default theme
