const baseStyle = {
  indicator: {
    background: "gray.700",
    padding: "4",
    "&[data-status=incomplete]": {
      borderWidth: 0,
    },
    "&[data-status=active]": {
      borderColor: "indigo.500",
    },
    "&[data-status=complete]": {
      background: "indigo.500",
      color: "white",
    },
  },
  step: {
    flex: "unset",
  },
  title: {
    "&[data-status=incomplete]": {
      fontWeight: "normal",
      fontSize: "xs",
      color: "gray.300",
    },
  },
}

const stepperTheme = {
  baseStyle,
}

export default stepperTheme
