import { getColor, mode, transparentize } from "@chakra-ui/theme-tools"

type Dict = Record<string, any>

const getBg = (props: Dict) => {
  const { theme, colorScheme: c } = props
  const lightBg = getColor(theme, `${c}.50`, c)
  const darkBg = transparentize(`${c}.200`, 0.16)(theme)
  return mode(lightBg, darkBg)(props)
}

const styles = {
  parts: ["container", "icon"],
  baseStyle: {
    container: {
      borderRadius: "xl",
    },
  },
  variants: {
    subtle: (props: Dict) => {
      const { colorScheme: c } = props
      return {
        container: {
          bg: getBg(props),
          py: 4,
          alignItems: "flex-start",
        },
        icon: {
          color: mode(`${c}.500`, `${c}.200`)(props),
          mt: "3px",
        },
      }
    },
    toastSubtle: (props: Dict) => {
      const { theme, colorScheme: c } = props
      return {
        container: {
          bg: transparentize(`${c}.200`, 0.16)(theme),
          py: 4,
        },
        icon: {
          color: mode(`${c}.500`, `${c}.400`)(props),
        },
      }
    },
    ghost: (props: Dict) => {
      const { colorScheme: c } = props
      return {
        container: {
          bg: "transparent",
          px: 0,
          alignItems: "flex-start",
        },
        icon: {
          color: mode(`${c}.500`, `${c}.200`)(props),
        },
      }
    },
  },
}

export default styles
