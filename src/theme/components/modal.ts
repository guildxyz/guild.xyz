const styles = {
  parts: ["dialog", "closeButton", "header", "footer", "body"],
  baseStyle: {
    dialog: {
      borderRadius: "xl",
      overflow: "hidden",
      my: "auto",
    },
    closeButton: {
      borderRadius: "full",
      top: 7,
      right: 7,
    },
    header: {
      px: 10,
      py: 8,
      fontFamily: "display",
      fontWeight: "bold",
    },
    body: {
      px: 10,
      pb: 10,
    },
    footer: {
      px: 10,
      pt: 2,
      pb: 10,
      "> *": {
        w: "full",
      },
    },
  },
}

export default styles
