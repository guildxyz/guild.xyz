import { alertAnatomy as parts } from "@chakra-ui/anatomy"
import {
  getColor,
  mode,
  PartsStyleFunction,
  PartsStyleObject,
  transparentize,
} from "@chakra-ui/theme-tools"

type Dict = Record<string, any>

const getBg = (props: Dict) => {
  const { theme, colorScheme: c } = props
  const lightBg = getColor(theme, `${c}.50`, c)
  const darkBg = transparentize(`${c}.200`, 0.16)(theme)
  return mode(lightBg, darkBg)(props)
}

const baseStyle: PartsStyleObject<typeof parts> = {
  container: {
    py: 4,
    borderRadius: "xl",
  },
}

const variantSubtle: PartsStyleFunction<typeof parts> = (props) => {
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
}
const variantToastSubtle: PartsStyleFunction<typeof parts> = (props) => {
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
}
const variantGhost: PartsStyleFunction<typeof parts> = (props) => {
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
}

const variants = {
  subtle: variantSubtle,
  toastSubtle: variantToastSubtle,
  ghost: variantGhost,
}

const styles = {
  parts: ["container", "icon"],
  baseStyle,
  variants,
}

export default styles
