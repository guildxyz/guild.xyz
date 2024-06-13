import { SystemStyleInterpolation, SystemStyleObject } from "@chakra-ui/react"
import Input from "./input"

const variants: Record<string, SystemStyleInterpolation> = {
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  outline: (props) => Input.variants.outline(props).field ?? {},
}

const sizes: Record<string, SystemStyleObject> = {
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  xs: Input.sizes.xs.field ?? {},
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  sm: Input.sizes.sm.field ?? {},
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  md: Input.sizes.md.field ?? {},
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  lg: Input.sizes.lg.field ?? {},
}

const styles = {
  baseStyle: {
    paddingY: "12px",
  },
  variants,
  sizes,
  defaultProps: {
    focusBorderColor: "primary.500",
  },
}

export default styles
