import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { inter, dystopian } from "fonts"
import "./globals.css"
import clsx from "clsx"

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: "Guildhall",
  description: "Recreating a portion of guild.xyz using RadixUI",
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
