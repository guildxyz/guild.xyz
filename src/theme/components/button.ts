import { mode } from "@chakra-ui/theme-tools"

type Dict = Record<string, any>

const variantSolidStatic = (props: Dict) => {
  const { colorScheme: c } = props

  if (c === "gray") {
    const bg = mode(`gray.100`, `whiteAlpha.200`)(props)

    return {
      bg,
    }
  }

  return {
    bg: mode(`${c}.500`, `${c}.200`)(props),
    color: mode("white", `gray.800`)(props),
  }
}

const styles = {
  baseStyle: {
    borderRadius: "xl",
  },
  sizes: {
    md: {
      h: "var(--chakra-space-11)",
    },
    xl: {
      fontSize: "lg",
      h: 14,
      px: 8,
    },
  },
  variants: {
    solidStatic: variantSolidStatic,
  },
}

export default styles
