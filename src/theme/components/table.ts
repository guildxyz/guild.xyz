import { tableAnatomy as parts } from "@chakra-ui/anatomy"
import { createMultiStyleConfigHelpers } from "@chakra-ui/react"
import { mode } from "@chakra-ui/theme-tools"

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(
  parts.keys
)

const variantSimple = definePartsStyle((props) => {
  const { colorScheme: c } = props

  return {
    th: {
      color: mode("gray.600", "gray.400")(props),
      borderBottom: "1px",
      borderRightWidth: "1px",
      borderColor: mode(`${c}.200`, `${c}.600`)(props),
      "&:last-of-type": {
        borderRightWidth: 0,
      },
    },
    td: {
      borderBottom: "1px",
      borderRightWidth: "1px !important",
      borderColor: mode(`${c}.200`, `${c}.600`)(props),
      "&:last-of-type": {
        borderRightWidth: "0 !important",
      },
    },
    caption: {
      color: mode("gray.600", "gray.100")(props),
    },
    tbody: {
      tr: {
        "&:last-of-type": {
          td: { border: "inherit" },
        },
      },
    },
    tfoot: {
      tr: {
        "&:last-of-type": {
          th: { borderBottomWidth: 0 },
        },
      },
    },
  }
})

const variants = {
  simple: variantSimple,
}

export default defineMultiStyleConfig({
  variants,
})
