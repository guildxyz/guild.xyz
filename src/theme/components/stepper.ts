const baseStyle = {
  indicator: {
    background: "gray.700",
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
    "&[data-status=incomplete]": {
      fontWeight: "normal",
      color: "gray.600",
      _dark: {
        color: "gray.300",
      },
    },
  },
}

const stepperTheme = {
  baseStyle,
}

export default stepperTheme
