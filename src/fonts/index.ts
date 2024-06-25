import { Inter } from "next/font/google"
import localFont from "next/font/local"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  fallback: ["sans-serif"],
})

const dystopian = localFont({
  src: [
    {
      path: "Dystopian-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "Dystopian-Regular.woff2",
      style: "normal",
    },
    {
      path: "Dystopian-Bold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "Dystopian-Black.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-dystopian",
  fallback: ["sans-serif"],
})

export { dystopian, inter }
