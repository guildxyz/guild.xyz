import { createMultiStyleConfigHelpers } from "@chakra-ui/react"

const { definePartsStyle } = createMultiStyleConfigHelpers([
  "stepper",
  "step",
  "title",
  "description",
  "indicator",
  "separator",
  "icon",
  "number",
])

const baseStyle = definePartsStyle(({ colorScheme: c }) => ({
  ...(c === "primary"
    ? {
        indicator: {
          background: "gray.200",
          _dark: { background: "gray.700" },
          padding: "3.5",
          "&[data-status=incomplete]": {
            borderColor: "transparent",
          },
          "&[data-status=active]": {
            borderColor: "primary",
          },
          "&[data-status=complete]": {
            background: "primary",
            color: "white",
            borderWidth: "2px",
          },
        },
        separator: {
          "&[data-status=complete]": {
            background: "primary.500",
          },
        },
      }
    : {}),
  step: {
    flex: "unset",
  },
  title: {
    "&[data-status=active]": {
      fontWeight: "semibold",
    },
    "&[data-status=incomplete]": {
      color: "gray",
      _dark: {
        color: "whiteAlpha.600",
      },
    },
  },
}))

const stepperTheme = {
  baseStyle,
}

export default stepperTheme
