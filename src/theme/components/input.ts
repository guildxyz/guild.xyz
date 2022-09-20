import { inputAnatomy as parts } from "@chakra-ui/anatomy"
import {
  createMultiStyleConfigHelpers,
  defineStyle,
  PartsStyleFunction,
  PartsStyleObject,
  SystemStyleObject,
} from "@chakra-ui/react"
import { mode } from "@chakra-ui/theme-tools"

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  parts.keys
)

const size: Record<string, SystemStyleObject> = {
  lg: defineStyle({
    fontSize: "md",
    borderRadius: "xl",
  }),
  md: defineStyle({
    borderRadius: "lg",
  }),
  sm: defineStyle({
    borderRadius: "lg",
  }),
  xs: defineStyle({
    borderRadius: "md",
  }),
}

const sizes: Record<string, PartsStyleObject<typeof parts>> = {
  lg: definePartsStyle({
    field: size.lg,
    addon: size.lg,
  }),
  md: definePartsStyle({
    field: size.md,
    addon: size.md,
  }),
  sm: definePartsStyle({
    field: size.sm,
    addon: size.sm,
  }),
  xs: definePartsStyle({
    field: size.xs,
    addon: size.xs,
  }),
}

const variantOutline: PartsStyleFunction<typeof parts> = definePartsStyle(
  (props) => {
    return {
      field: {
        bg: mode("white", "blackAlpha.300")(props),
      },
      addon: {
        bg: mode("gray.100", "gray.700")(props),
      },
    }
  }
)

const variants = {
  outline: variantOutline,
}

const styles = defineMultiStyleConfig({
  defaultProps: {
    focusBorderColor: "primary.500",
  } as any,
  sizes,
  variants,
})

export default styles
