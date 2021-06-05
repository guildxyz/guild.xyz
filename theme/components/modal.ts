export default {
  parts: ["dialog", "closeButton", "header", "footer", "body"],
  baseStyle: {
    dialog: {
      borderRadius: "xl",
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
      fontFamily: "Dystopian",
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
