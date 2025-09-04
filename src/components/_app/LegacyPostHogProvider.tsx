import { CustomPostHogProvider } from "@/components/Providers/PostHogProvider"
import { useRouter } from "next/router"
import posthog from "posthog-js"
import {
  PostHogProvider as DefaultPostHogProvider,
  usePostHog,
} from "posthog-js/react"
import { ReactNode, useEffect } from "react"

/**
 * UseRouter doesn't work in app router & we also need to track page change events
 * differently there, so we made this LegacyPostHogProvider which contains the page
 * router related logic.
 *
 * We can delete it once we migrate to app router.
 */

function LegacyPostHogPageViews() {
  const router = useRouter()
  const posthog = usePostHog()

  useEffect(() => {
    const handleRouteChange = () => posthog.capture("$pageview")
    router.events.on("routeChangeComplete", handleRouteChange)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export function LegacyPostHogProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <DefaultPostHogProvider client={posthog}>
      <CustomPostHogProvider>
        {children}
        <LegacyPostHogPageViews />
      </CustomPostHogProvider>
    </DefaultPostHogProvider>
  )
}
