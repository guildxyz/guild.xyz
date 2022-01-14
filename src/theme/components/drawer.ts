import { mode } from "@chakra-ui/theme-tools"

type Dict = Record<string, any>

const styles = {
  parts: ["dialog", "closeButton", "header", "footer", "body"],
  baseStyle: (props: Dict) => ({
    dialog: {
      bg: mode("gray.100", "gray.800")(props),
      bgGradient: mode(
        `linear(white 0px, var(--chakra-colors-gray-100) 700px)`,
        `linear(var(--chakra-colors-gray-800) 0px, var(--chakra-colors-gray-100) 700px)`
      )(props),
      bgBlendMode: mode("normal", "color")(props),
      // we can't add data attributes to the Drawer component so we have
      // to prevent the focus-visible polyfill from removing shadow on
      // focus by overriding it's style with the default box-shadow
      ":focus:not([data-focus-visible-added])": {
        boxShadow: mode("lg", "dark-lg")(props),
      },
    },
    closeButton: {
      borderRadius: "full",
      top: 6,
      right: 5,
    },
    header: {
      bg: mode("white", "gray.700")(props),
      pl: { base: 6, sm: 10 },
      pr: { base: 16, sm: 10 },
      py: 6,
      fontFamily: "display",
      fontWeight: "bold",
      // borderBottom: "1px",
      boxShadow: "sm",
      borderColor: "gray.200",
    },
    body: {
      px: { base: 6, sm: 10 },
      pt: 8,
      pb: { base: 9, sm: 10 },
    },
    footer: {
      pos: "relative",
      bg: mode("white", "gray.700")(props),
      px: { base: 6, sm: 10 },
      boxShadow: "0 -1px 2px 0 rgba(0, 0, 0, 0.05)",
    },
  }),
}

export default styles
