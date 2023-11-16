const baseStyle = {
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
      borderColor: "transparent",
      borderWidth: "2px",
    },
  },
  separator: {
    "&[data-status=complete]": {
      background: "primary.500",
    },
  },
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
}

const stepperTheme = {
  baseStyle,
}

export default stepperTheme
