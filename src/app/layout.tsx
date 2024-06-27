import type { Metadata } from "next"
import { ThemeProvider } from "@/components/ThemeProvider"
import { inter, dystopian } from "fonts"
import "./globals.css"
import clsx from "clsx"

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
          attribute="class"
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
