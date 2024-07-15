import { Providers } from "@/components/Providers"
import { PostHogPageViews } from "@/components/Providers/PostHogPageViews"
import clsx from "clsx"
import { dystopian, inter } from "fonts"
import type { Metadata } from "next"
import { type ReactNode, Suspense } from "react"
import "./globals.css"
import { cn } from "@/lib/utils"

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
      <body className={cn(dystopian.variable, inter.variable, "antialiased")}>
        <Providers>
          {children}

          <Suspense>
            <PostHogPageViews />
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}
