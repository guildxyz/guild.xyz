import { tabsAnatomy as parts } from "@chakra-ui/anatomy"
import { createMultiStyleConfigHelpers, cssVar, defineStyle } from "@chakra-ui/react"
import { mode, transparentize } from "@chakra-ui/theme-tools"

const $fg = cssVar("tabs-color")
const $bg = cssVar("tabs-bg")

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(
  parts.keys
)

const baseStyleTabpanel = defineStyle({
  p: 0,
})

const baseStyle = definePartsStyle((props) => ({
  tabpanel: baseStyleTabpanel,
}))

const variantSubtle = definePartsStyle((props) => {
  const { colorScheme: c, theme } = props
  const darkBg = transparentize(`${c}.200`, 0.16)(theme)

  return {
    tab: {
      borderRadius: "lg",
      fontWeight: "semibold",
      color: mode(`gray.800`, `gray.200`)(props),
      bg: mode(`gray.100`, "whiteAlpha.50")(props),

      _hover: {
        _disabled: {
          bg: mode(`${c}.100`, "whiteAlpha.50")(props),
        },
      },
      _selected: {
        color: mode(`${c}.800`, `${c}.200`)(props),
        bg: mode(`${c}.100`, darkBg)(props),
      },
    },
    tablist: {
      gap: 2,
    },
  }
})

const variantSolid = definePartsStyle((props) => {
  const { colorScheme: c } = props

  return {
    tab: {
      borderRadius: "lg",
      fontWeight: "semibold",

      [$bg.variable]: "colors.gray.100",
      _hover: {
        [$bg.variable]: "colors.gray.200",
      },

      _dark: {
        [$bg.variable]: "colors.whiteAlpha.100",
        _hover: {
          [$bg.variable]: "colors.whiteAlpha.200",
        },
      },
      _selected: {
        [$fg.variable]: "colors.white",
        [$bg.variable]: `colors.${c}.600`,
        _dark: {
          [$bg.variable]: `colors.${c}.500`,
        },
      },
      color: $fg.reference,
      bg: $bg.reference,
    },
    tablist: {
      gap: 2,
    },
  }
})

const variants = {
  subtle: variantSubtle,
  solid: variantSolid,
}

export default defineMultiStyleConfig({
  baseStyle,
  variants,
})
