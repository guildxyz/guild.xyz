const styles = {
  parts: ["dialog", "closeButton", "header", "footer", "body"],
  baseStyle: {
    dialog: {
      borderTopRadius: "xl",
      borderBottomRadius: { base: 0, sm: "xl" },
      overflow: "hidden",
      marginTop: "auto",
      marginBottom: { base: 0, sm: "auto" },
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
    },
    body: {
      px: { base: 6, sm: 10 },
      pt: { base: 1, sm: 2 },
      pb: { base: 9, sm: 10 },
    },
    footer: {
      px: { base: 6, sm: 10 },
      pt: 2,
      pb: 10,
      "> *": {
        w: "full",
      },
    },
  },
}

export default styles
