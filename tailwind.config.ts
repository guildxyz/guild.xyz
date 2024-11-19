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
        card: "var(--card)",
        image: "var(--image)",
        skeleton: "var(--skeleton)",
        badge: {
          background: "var(--badge-background)",
          foreground: "var(--badge-foreground)"
        },
        "drawer-handle": "var(--drawer-handle)"
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config

export default config
