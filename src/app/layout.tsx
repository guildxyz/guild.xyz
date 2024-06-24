import type { Metadata } from "next"
import { ThemeProvider } from "@/components/ThemeProvider"
import { inter, dystopian } from "fonts"
import "./globals.css"
import clsx from "clsx"
import { IconProvider } from "@/components/IconProvider"

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: "Guildhall",
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <IconProvider>
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
      </IconProvider>
    </html>
  )
}
