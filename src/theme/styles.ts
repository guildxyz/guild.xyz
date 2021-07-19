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
  }),
}

export default styles
