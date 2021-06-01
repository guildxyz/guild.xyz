import { extendTheme, theme as baseTheme } from "@chakra-ui/react"

const theme = extendTheme({
  colors: {
    primary: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
    },
  },
  fonts: {
    body: "Inter var, Inter",
    heading: "Inter var, Inter",
  },
  shadows: {
    outline: "0 0 0 4px rgba(170, 170, 170, 0.6)",
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: baseTheme.radii.lg,
      },
    },
  },
})

export default theme
