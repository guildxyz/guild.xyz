import { extendTheme } from "@chakra-ui/react"
import components from "./components"
import colors from "./colors"

const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
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
})

export default theme
