import { mode } from "@chakra-ui/theme-tools"

const styles = {
  defaultProps: {
    focusBorderColor: "primary.500",
  },
  baseStyle: {
    bg: mode("white", "blackAlpha.300"),
    borderRadius: "xl",
  },
}

export default styles
