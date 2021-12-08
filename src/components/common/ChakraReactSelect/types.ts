import { CSSWithMultiValues } from "@chakra-ui/react"
import { Props, ThemeSpacing } from "react-select"
import { Rest } from "types"

export type { RecursiveCSSObject } from "@chakra-ui/react"
export type { Theme } from "react-select"

export type Size = "sm" | "md" | "lg"

export type TagVariant = "subtle" | "solid" | "outline" | undefined

export type SelectedOptionStyle = "color" | "check"

export type ChakraSelectProps = {
  size?: Size
  colorScheme?: string
  isDisabled?: boolean
  isInvalid?: boolean
  tagVariant?: TagVariant
  hasStickyGroupHeaders?: boolean
  selectedOptionStyle?: SelectedOptionStyle
  selectedOptionColor?: string
  styles?: any
  components?: any
  children?: any
  theme?: any
  inputId?: any
} & Props & { options: { label: string; value: string } & Rest } & Rest

export type OptionalTheme = {
  borderRadius?: number
  colors?: { [key: string]: string }
  spacing?: ThemeSpacing
}

export interface SxProps extends CSSWithMultiValues {
  _disabled: CSSWithMultiValues
  _focus: CSSWithMultiValues
}

export type SizeProps = {
  sm: string | number
  md: string | number
  lg: string | number
}
