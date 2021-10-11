import { mode } from "@chakra-ui/theme-tools"

type Dict = Record<string, any>

function variantSubtle(props: Dict) {
  const { colorScheme: c } = props

  if (c === "alpha") {
    return {
      container: {
        bg: mode("blackAlpha.100", "whiteAlpha.200")(props),
        color: mode("blackAlpha.700", "whiteAlpha.800")(props),
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
