import { inputAnatomy as parts } from "@chakra-ui/anatomy"
import {
  mode,
  PartsStyleFunction,
  PartsStyleObject,
  SystemStyleObject,
} from "@chakra-ui/theme-tools"

const size: Record<string, SystemStyleObject> = {
  lg: {
    borderRadius: "xl",
  },

  md: {
    borderRadius: "lg",
  },

  sm: {
    borderRadius: "lg",
  },

  xs: {
    borderRadius: "md",
  },
}

const sizes: Record<string, PartsStyleObject<typeof parts>> = {
  lg: {
    field: size.lg,
    addon: size.lg,
  },
  md: {
    field: size.md,
    addon: size.md,
  },
  sm: {
    field: size.sm,
    addon: size.sm,
  },
  xs: {
    field: size.xs,
    addon: size.xs,
  },
}

const variantOutline: PartsStyleFunction<typeof parts> = (props) => {
  return {
    field: {
      bg: mode("white", "blackAlpha.300")(props),
    },
    addon: {
      bg: mode("gray.100", "gray.700")(props),
    },
  }
}

const variants = {
  outline: variantOutline,
}

const styles = {
  parts: ["field"],
  defaultProps: {
    focusBorderColor: "primary.500",
  },
  sizes,
  variants,
}

export default styles
