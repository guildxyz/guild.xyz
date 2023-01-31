import { defineStyle, defineStyleConfig } from "@chakra-ui/react"
import { cssVar } from "@chakra-ui/theme-tools"

const $size = cssVar("spinner-size")

const baseStyle = defineStyle({
  width: [$size.reference],
  height: [$size.reference],
})

const sizes = {
  "2xl": defineStyle({
    [$size.variable]: "sizes.28",
  }),
}

export default defineStyleConfig({
  baseStyle,
  sizes,
})
