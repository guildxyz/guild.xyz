import { mode } from "@chakra-ui/theme-tools"

type Dict = Record<string, any>

const styles = {
  baseStyle: (props: Dict) => {
    const { colorScheme: c } = props

    return {
      display: "inline-flex",
      alignItems: "center",
      color: mode(`${c}.600`, `${c}.400`)(props),
    }
  },
}

export default styles
