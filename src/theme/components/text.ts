import { mode } from "@chakra-ui/theme-tools"

type Dict = Record<string, any>

const styles = {
  baseStyle: (props: Dict) => {
    const { colorScheme: c } = props

    if (c === "gray") {
      return {
        color: mode("gray", "whiteAlpha.600")(props),
      }
    }
  },
}

export default styles
