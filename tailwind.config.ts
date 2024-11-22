import type { Config } from "tailwindcss"
import animatePlugin from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    fontFamily: {
      sans: ["var(--font-inter,sans-serif)"],
      display: ["var(--font-dystopian,sans-serif)"],
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: {
          DEFAULT: "var(--foreground)",
          secondary: "var(--foreground-secondary)"
        },
        primary: "var(--primary)",
        card: "var(--card)",
        image: "var(--image)",
        skeleton: "var(--skeleton)",
        border: "var(--border)",
        input: {
          background: "var(--input-background)",
          border: {
            DEFAULT: "var(--input-border)",
            accent: "var(--input-border-accent)",
            invalid: "var(--input-border-invalid)"
          },
        },
        // Using these in our Toggle component
        button: {
          primary: {
            background: "var(--button-primary)",
            foreground: "var(--button-primary-foreground)"
          },
          secondary: {
            background: {
              DEFAULT: "var(--button-secondary)",
              hover: "var(--button-secondary-hover)",
              active: "var(--button-secondary-active)",
            },
            foreground: "var(--button-secondary-foreground)"
          }
        },
        badge: {
          background: "var(--badge-background)",
          foreground: "var(--badge-foreground)"
        },
        "drawer-handle": "var(--drawer-handle)",
        "scroll-thumb": "var(--scroll-thumb)"
      },
      keyframes: {
        "collapse-open": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-collapsible-content-height)", opacity: "1" },
        },
        "collapse-closed": {
          from: { height: "var(--radix-collapsible-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
      },
      animation: {
        "collapse-open": "collapse-open 200ms ease-out",
        "collapse-closed": "collapse-closed 200ms ease-out",
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config

export default config
