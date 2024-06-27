import "./globals.css"

import { cn } from "@/lib/utils"
import { inter } from "fonts"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "font-inter min-h-screen bg-background antialiased",
          inter.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}
