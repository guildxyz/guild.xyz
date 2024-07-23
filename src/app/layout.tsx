import { dystopian, inter } from "fonts"
import type { Metadata } from "next"
import { type ReactNode } from "react"
import "./globals.css"
import { TooltipProvider } from "@/components/ui/Tooltip"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "next-themes"

interface RootLayoutProps {
  children: ReactNode
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

      <body className={cn(dystopian.variable, inter.variable)}>
        <ThemeProvider
          attribute="data-theme"
          storageKey="chakra-ui-color-mode"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
