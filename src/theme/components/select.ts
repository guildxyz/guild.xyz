import { selectAnatomy as parts } from "@chakra-ui/anatomy"
import {
  mode,
  PartsStyleFunction,
  PartsStyleObject,
  SystemStyleFunction,
} from "@chakra-ui/theme-tools"
import Input from "./input"

const sizes: Record<string, PartsStyleObject<typeof parts>> = {
  ...Input.sizes,
  xs: {
    ...Input.sizes.xs,
    icon: { insetEnd: "0.25rem" },
  },
}

const baseStyleField: SystemStyleFunction = (props) => {
  return {
    bg: mode("white", "blackAlpha.300")(props),
  }
}

const baseStyle: PartsStyleFunction<typeof parts> = (props) => ({
  field: baseStyleField(props),
})

const styles = {
  parts: parts.keys,
  baseStyle,
  variants: Input.variants,
  defaultProps: Input.defaultProps,
  sizes,
}

export default styles
