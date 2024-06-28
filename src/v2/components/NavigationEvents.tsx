"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { posthog } from "posthog-js"
import { useEffect } from "react"

export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    posthog.capture("$pageview")
  }, [pathname, searchParams])

  return null
}
