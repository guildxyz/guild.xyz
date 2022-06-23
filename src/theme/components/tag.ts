import { mode, transparentize } from "@chakra-ui/theme-tools"

type Dict = Record<string, any>

function variantSubtle(props: Dict) {
  const { colorScheme: c, theme } = props

  if (c === "alpha") {
    return {
      container: {
        bg: mode("blackAlpha.100", "whiteAlpha.200")(props),
        color: mode("blackAlpha.700", "whiteAlpha.800")(props),
      },
    }
  }

  if (c === "green") {
    return {
      container: {
        bg: transparentize("green.600", 0.12)(theme),
      },
    }
  }
}

const defaultProps = {
  colorScheme: "alpha",
}

const styles = {
  variants: {
    subtle: variantSubtle,
  },
  defaultProps,
}

export default styles
