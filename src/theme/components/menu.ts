const styles = {
  parts: ["list"],
  baseStyle: {
    list: {
      boxShadow: "lg",
      // we can't add data attributes to the Menu component so we have
      // to prevent the focus-visible polyfill from removing shadow on
      // focus by overriding it's style with the default box-shadow
      ":focus:not([data-focus-visible-added])": {
        boxShadow: "lg",
      },
    },
  },
}

export default styles
