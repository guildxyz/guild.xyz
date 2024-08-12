import { mode } from "@chakra-ui/theme-tools"

const styles = {
  global: (props) => ({
    ":root": {
      "--fg-color": "var(--chakra-colors-chakra-body-text) !important",
      "--fg-color-2": "var(--chakra-colors-chakra-body-text) !important",
      "--fg-color-3": "var(--chakra-colors-chakra-body-text) !important",
      "--fg-color-5": "var(--chakra-colors-gray-600) !important",
    },

    body: {
      background: "hsl(var(--background))",
      backgroundColor: "hsl(var(--background))",
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
    ".dotlottie-container:not(.keep-colors) path": {
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
    "@keyframes rotate": {
      from: {
        transform: "rotate(0)",
      },
      to: {
        transform: "rotate(360deg)",
      },
    },

    "#walletconnect-wrapper": {
      color: "black",
    },

    ".intercom-lightweight-app": {
      zIndex: "banner !important",
    },
    ".lexical-content-editable": {
      resize: "vertical",
      overflow: "auto",
      padding: "0.5rem",
      minHeight: "4rem",
      backgroundColor: "var(--chakra-colors-blackAlpha-300)",
      border: "1px solid transparent",
      ":focus-visible": {
        borderRadius: "inherit",
        borderTopRadius: "none",
        outline: "none",
        border: "1px solid var(--chakra-colors-gray-500)",
        boxShadow: "0 0 0 1px var(--chakra-colors-gray-500)",
      },
      h1: {
        fontWeight: "bold",
        fontSize: "var(--chakra-fontSizes-2xl)",
      },
      h2: {
        fontWeight: "bold",
        fontSize: "var(--chakra-fontSizes-lg)",
      },
      ul: {
        marginLeft: "1rem",
        listStyle: "disc",
      },
      ol: {
        marginLeft: "1rem",
        listStyle: "decimal",
      },
      blockquote: {
        borderLeft: "2px",
        paddingLeft: "1rem",
        borderColor: "var(--chakra-colors-gray-500)",
      },
      a: {
        color: "var(--chakra-colors-blue-500)",
      },
    },
    ".chakra-ui-light .lexical-content-editable": {
      backgroundColor: "var(--chakra-colors-white)",
    },

    ".noPointerEvents": {
      pointerEvents: "none",
    },
  }),
}

export default styles
