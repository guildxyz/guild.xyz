import { Providers } from "@/components/Providers"
import { PostHogPageViews } from "@/components/Providers/PostHogPageViews"
import clsx from "clsx"
import { dystopian, inter } from "fonts"
import type { Metadata } from "next"
import { type ReactNode, Suspense } from "react"
import "./globals.css"
import { cn } from "@/lib/utils"
import NextTopLoader from "nextjs-toploader"

interface RootLayoutProps {
  children: ReactNode
}

export const metadata: Metadata = {
  title: "Guildhall",
  applicationName: "Guildhall",
  description:
    "Automated membership management for the platforms your community already uses.",
  icons: {
    icon: "guild-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn(dystopian.variable, inter.variable)}>
        <NextTopLoader showSpinner={false} color="#eff6ff" height={3} />

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
