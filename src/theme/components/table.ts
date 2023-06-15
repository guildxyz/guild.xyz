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
      borderColor: mode(`${c}.100`, `${c}.600`)(props),
    },
    td: {
      borderBottom: "1px",
      borderColor: mode(`${c}.100`, `${c}.600`)(props),
    },
    caption: {
      color: mode("gray.600", "gray.100")(props),
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
