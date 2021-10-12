import { SystemStyleInterpolation, SystemStyleObject } from "@chakra-ui/theme-tools"
import Input from "./input"

const variants: Record<string, SystemStyleInterpolation> = {
  outline: (props) => Input.variants.outline(props).field ?? {},
}

const sizes: Record<string, SystemStyleObject> = {
  xs: Input.sizes.xs.field ?? {},
  sm: Input.sizes.sm.field ?? {},
  md: Input.sizes.md.field ?? {},
  lg: Input.sizes.lg.field ?? {},
}

export default {
  variants,
  sizes,
}
