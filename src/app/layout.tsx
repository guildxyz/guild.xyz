import { Providers } from "@/components/Providers"
import { PostHogPageViews } from "@/components/Providers/PostHogPageViews"
import { dystopian, inter } from "fonts"
import { type ReactNode, Suspense } from "react"
import "./globals.css"
import { cn } from "@/lib/utils"
import type { Metadata, Viewport } from "next"
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
    { media: "(prefers-color-scheme: dark)", color: "#27272a" },
    { media: "(prefers-color-scheme: light)", color: "#f4f4f5" },
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

        <canvas
          id="js-confetti-canvas"
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            zIndex: 10001,
            pointerEvents: "none",
          }}
        />
      </body>
    </html>
  )
}
