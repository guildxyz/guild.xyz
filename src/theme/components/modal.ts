import { mode } from "@chakra-ui/theme-tools"

type Dict = Record<string, any>

const styles = {
  parts: ["dialog", "closeButton", "header", "footer", "body"],
  baseStyle: (props: Dict) => {
    const { colorScheme: c, scrollBehavior } = props
    const darkBgColor = mode(
      "gray.50",
      c === "duotone" ? "#35353A" : "gray.800" // duotone dark color is from blackAlpha.300
    )(props)

    return {
      dialogContainer: {
        bottom: 0,
        height: "unset",
      },
      dialog: {
        borderTopRadius: "xl",
        borderBottomRadius: { base: 0, sm: "xl" },
        overflow: "hidden",
        marginTop: "auto",
        marginBottom: { base: 0, sm: "auto" },
        maxHeight: scrollBehavior === "inside" && {
          base: "calc(100% - var(--chakra-space-16))",
          sm: "calc(100% - 7.5rem)",
        },
        // we can't add data attributes to the Modal component so we have
        // to prevent the focus-visible polyfill from removing shadow on
        // focus by overriding it's style with the default box-shadow
        ":focus:not([data-focus-visible-added])": {
          boxShadow: mode("lg", "dark-lg")(props),
        },
      },
      closeButton: {
        borderRadius: "full",
        top: 7,
        right: 7,
      },
      header: {
        pl: { base: 6, sm: 10 },
        pr: { base: 16, sm: 10 },
        py: 8,
        fontFamily: "display",
        fontWeight: "bold",
        backgroundColor: c === "dark" && darkBgColor,
      },
      body: {
        px: { base: 6, sm: 10 },
        pt: { base: 1, sm: 2 },
        pb: { base: 9, sm: 10 },
        backgroundColor: c === "dark" && darkBgColor,
      },
      footer: {
        px: { base: 6, sm: 10 },
        pt: 2,
        pb: 10,
        backgroundColor: (c === "dark" || c === "duotone") && darkBgColor,
        borderTopWidth: c === "duotone" && 1,
      },
      overlay: {
        backdropFilter: "blur(4px)",
        height: "100%",
      },
    }
  },
}

export default styles
