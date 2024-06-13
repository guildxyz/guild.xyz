import { selectAnatomy as parts } from "@chakra-ui/anatomy"
import {
  PartsStyleFunction,
  PartsStyleObject,
  SystemStyleFunction,
} from "@chakra-ui/react"
import { mode } from "@chakra-ui/theme-tools"
import Input from "./input"

const sizes: Record<string, PartsStyleObject<typeof parts>> = {
  ...Input.sizes,
  xs: {
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    ...Input.sizes.xs,
    icon: { insetEnd: "0.25rem" },
  },
}

const baseStyleField: SystemStyleFunction = (props) => ({
  bg: mode("white", "blackAlpha.300")(props),
})

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
