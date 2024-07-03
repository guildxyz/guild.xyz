import { Providers } from "@/components/Providers"
// import { PostHogPageViews } from "@/components/Providers/PostHogPageViews"
import clsx from "clsx"
import { dystopian, inter } from "fonts"
import type { Metadata } from "next"
import { Suspense, type ReactNode } from "react"
import "./globals.css"

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
      <body className={clsx(dystopian.variable, inter.variable)}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
