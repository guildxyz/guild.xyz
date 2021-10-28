import { mode, transparentize } from "@chakra-ui/theme-tools"

type Dict = Record<string, any>

function variantSolid(props: Dict) {
  const { colorScheme: c } = props

  if (c === "gray") {
    const bg = mode(`gray.100`, `whiteAlpha.200`)(props)
    const disabledBg = mode(`gray.200`, `whiteAlpha.300`)(props)

    return {
      bg,
      _disabled: { bg: disabledBg },
      _hover: {
        bg: mode(`gray.200`, `whiteAlpha.300`)(props),
        _disabled: {
          bg: disabledBg,
        },
      },
      _active: { bg: mode(`gray.300`, `whiteAlpha.400`)(props) },
    }
  }
  if (c === "alpha") {
    const bg = mode(`blackAlpha.400`, `whiteAlpha.200`)(props)

    return {
      bg,
      color: "white",
      _disabled: { opacity: 0.8 },
      _hover: {
        bg: mode(`blackAlpha.500`, `whiteAlpha.300`)(props),
        _disabled: {
          bg,
        },
      },
      _active: { bg: mode(`blackAlpha.600`, `whiteAlpha.400`)(props) },
    }
  }

  const bg = `${c}.500`

  return {
    bg,
    color: "white",
    _hover: {
      bg: mode(`${c}.600`, `${c}.400`)(props),
      _disabled: { bg },
    },
    _active: { bg: mode(`${c}.700`, `${c}.300`)(props) },
  }
}

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

const variantOutline = (props: Dict) => {
  const { theme, colorScheme: c } = props

  return {
    border: "2px solid",
    borderColor:
      c !== "gray"
        ? mode(`${c}.500`, transparentize(`${c}.300`, 0.8)(theme))(props)
        : undefined,
  }
}

/**
 * We override the default because that's gray.100 and gray.200 on hover in light
 * mode and we need it to be transparent
 */
const variantGhost = (props) => {
  const { colorScheme: c, theme } = props

  if (c === "gray") {
    return {
      color: mode(`inherit`, `whiteAlpha.900`)(props),
      _hover: {
        bg: mode(`blackAlpha.200`, `whiteAlpha.200`)(props),
      },
      _active: { bg: mode(`blackAlpha.300`, `whiteAlpha.300`)(props) },
    }
  }

  const darkHoverBg = transparentize(`${c}.200`, 0.12)(theme)
  const darkActiveBg = transparentize(`${c}.200`, 0.24)(theme)

  return {
    color: mode(`${c}.600`, `${c}.200`)(props),
    bg: "transparent",
    _hover: {
      bg: mode(`${c}.50`, darkHoverBg)(props),
    },
    _active: {
      bg: mode(`${c}.100`, darkActiveBg)(props),
    },
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
    solid: variantSolid,
    ghost: variantGhost,
    solidStatic: variantSolidStatic,
    outline: variantOutline,
  },
}

export default styles
