import { mode } from "@chakra-ui/theme-tools"

const styles = {
  global: (props) => ({
    // hacky solution to the bug that toasts just partially follow the color mode if user switches after they're initialized.
    // We're changing the background of their container (since it works), and just apply the same color for them transparentized
    // in both light and dark mode (in alert.ts)
    ".chakra-toast__inner": {
      bg: mode("white", "gray.700")(props),
      borderRadius: "lg",
    },
    // removing left border radius from the custom ChakraReactSelect when it's inside a FormGroup component which has an InputLeftAddon component inside it.
    ".chakra-input__left-addon ~ * > div": {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    // adding padding to the input when we add an image as an InputLeftElement
    ".option-image ~ * > div": {
      paddingLeft: 5,
    },
  }),
}

export default styles
