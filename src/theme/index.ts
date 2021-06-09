import { extendTheme, theme as baseTheme } from "@chakra-ui/react"
import { Button, Alert, Modal } from "./components"
import colors from "./colors"

const theme = extendTheme({
  colors,
  space: {
    11: "2.75rem",
  },
  fonts: {
    body: "Inter var, Inter, sans-serif",
    heading: "Inter var, Inter, sans-serif",
  },
  shadows: {
    outline: "0 0 0 4px rgba(170, 170, 170, 0.6)",
  },
  components: {
    Button,
    Alert,
    Modal,
  },
})

export default theme
