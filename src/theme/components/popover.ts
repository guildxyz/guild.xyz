import { SystemStyleFunction, SystemStyleObject } from "@chakra-ui/react"
import { cssVar, mode } from "@chakra-ui/theme-tools"

const $popperBg = cssVar("popper-bg")

const $arrowBg = cssVar("popper-arrow-bg")
const $arrowShadowColor = cssVar("popper-arrow-shadow-color")

const baseStyleContent: SystemStyleFunction = (props) => {
  const bg = mode("white", "gray.700")(props)
  const shadowColor = mode("gray.200", "whiteAlpha.300")(props)

  return {
    [$popperBg.variable]: `colors.${bg}`,
    bg: $popperBg.reference,
    [$arrowBg.variable]: $popperBg.reference,
    [$arrowShadowColor.variable]: `colors.${shadowColor}`,
    width: "xs",
    border: "1px solid",
    borderColor: "inherit",
    borderRadius: "xl",
    boxShadow: "xl",
    zIndex: "inherit",
    _focus: {
      outline: 0,
      boxShadow: "outline",
    },
    // we can't add data attributes to the Popover component so we have
    // to prevent the focus-visible polyfill from removing shadow on
    // focus by overriding it's style with the default box-shadow
    ":focus:not([data-focus-visible-added])": {
      boxShadow: "xl",
    },
  }
}

const baseStyleHeader: SystemStyleObject = {
  px: 4,
  py: 2,
  borderBottomWidth: "1px",
}

const baseStyleCloseButton: SystemStyleObject = {
  position: "absolute",
  borderRadius: "md",
  top: 2,
  insetEnd: 2,
  padding: 2,
}

const baseStyle = (props) => ({
  content: baseStyleContent(props),
  header: baseStyleHeader,
  closeButton: baseStyleCloseButton,
})

export default {
  parts: ["content", "closeButton"],
  baseStyle,
}
