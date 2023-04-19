import { mode } from "@chakra-ui/theme-tools"
import "react-notion-x/src/styles.css"

const styles = {
  global: (props) => ({
    ":root": {
      "--fg-color": "var(--chakra-colors-chakra-body-text) !important",
      "--fg-color-2": "var(--chakra-colors-chakra-body-text) !important",
      "--fg-color-3": "var(--chakra-colors-chakra-body-text) !important",
      "--fg-color-5": "var(--chakra-colors-gray-600) !important",
    },

    ul: {
      listStyle: "none",
    },
    /**
     * TODO: we want smooth scrolling for anchor tags, but don"t want it for page
     * navigation (e.g. explorer to guild)
     */
    // html: {
    //   scrollBehavior: "smooth",
    // },
    // "@media screen and (prefers-reduced-motion: reduce)": {
    //   html: {
    //     scrollBehavior: "auto",
    //   },
    // },
    "tbody > tr:last-child > td": {
      border: 0,
    },
    /**
     * Hacky solution to the bug that toasts just partially follow the color mode if
     * user switches after they're initialized. We're changing the background of
     * their container (since it works), and just apply the same color for them
     * transparentized in both light and dark mode (in alert.ts)
     */
    ".chakra-toast__inner": {
      bg: mode("white", "gray.700")(props),
      borderRadius: "lg",
    },
    /**
     * Chakra manages styles in FormGroup regardless if it has InputLeftAddon or
     * InputLeftElement components inside it via Context instead of plain css.
     * ChakraReactSelect can't read that context, so we're applying the desired rules
     * for that manually
     */
    ".chakra-input__left-addon ~ * > div": {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    "#lottie path": {
      fill: mode("currentColor", "white")(props),
      stroke: mode("currentColor", "white")(props),
      strokeWidth: "2px",
    },
    ".chakra-input__left-element ~ * > div": {
      paddingInlineStart: 5,
    },
    "@keyframes fadeIn": { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
    "@keyframes slideFadeIn": {
      "0%": { opacity: 0, transform: "translateY(10px)" },
      "100%": { opacity: 1, transform: "translateY(0px)" },
    },

    ".notion-page": {
      width: "var(--chakra-sizes-full) !important",
      "@media (min-width : 1080px)": {
        borderRadius: "15px",
        background: "var(--chakra-colors-whiteAlpha-50)",
        paddingX: "6 !important",
        paddingY: "20px !important",
      },
      display: "inline-block !important",
      ".notion-simple-table": {
        fontFamily: "var(--chakra-fonts-body)",
        lineHeight: "var(--chakra-lineHeights-base)",
        "tr:last-child td": {
          border: "1px solid var(--chakra-colors-gray-600)",
        },
        "tr td": {
          border: "1px solid var(--chakra-colors-gray-600)",
        },
      },
    },
    ".notion": {
      fontFamily: "var(--chakra-fonts-body)",
      lineHeight: "var(--chakra-lineHeights-base)",
    },

    "#walletconnect-wrapper": {
      color: "black",
    },
  }),
}

export default styles
