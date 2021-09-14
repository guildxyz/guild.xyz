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
    body: {
      "--chakra-radii-none": 0,
      "--chakra-radii-sm": 0,
      "--chakra-radii-base": 0,
      "--chakra-radii-md": 0,
      "--chakra-radii-lg": 0,
      "--chakra-radii-xl": 0,
      "--chakra-radii-2xl": 0,
      "--chakra-radii-3xl": 0,
      "--chakra-radii-full": 0,
    },
  }),
}

export default styles
