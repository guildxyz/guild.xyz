import { mode } from "@chakra-ui/theme-tools"

const styles = {
  parts: ["list"],
  baseStyle: (props) => {
    const boxShadow = mode("xl", "2xl")(props)

    return {
      list: {
        boxShadow,
        // we can't add data attributes to the Menu component so we have
        // to prevent the focus-visible polyfill from removing shadow on
        // focus by overriding it's style with the default box-shadow
        ":focus:not([data-focus-visible-added])": {
          boxShadow,
        },
      },
    }
  },
}

export default styles
