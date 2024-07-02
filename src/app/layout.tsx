import { ThemeProvider } from "@/components/ThemeProvider"
import clsx from "clsx"
import { dystopian, inter } from "fonts"
import type { Metadata } from "next"
import "./globals.css"

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: "Guildhall",
  description:
    "Automated membership management for the platforms your community already uses.",
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={clsx(dystopian.variable, inter.variable)}>
        <ThemeProvider
          attribute="data-theme"
          storageKey="chakra-ui-color-mode"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
