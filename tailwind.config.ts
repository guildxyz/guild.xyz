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
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        card: "var(--card)",
        image: "var(--image)",
        skeleton: "var(--skeleton)",
        border: "var(--border)",
        badge: {
          background: "var(--badge-background)",
          foreground: "var(--badge-foreground)"
        },
        "drawer-handle": "var(--drawer-handle)",
        "scroll-thumb": "var(--scroll-thumb)"
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config

export default config
