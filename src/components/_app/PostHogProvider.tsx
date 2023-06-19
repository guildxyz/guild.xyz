import useUser from "components/[guild]/hooks/useUser"
import { posthog } from "posthog-js"
import {
  PostHogProvider as DefaultPostHogProvider,
  usePostHog,
} from "posthog-js/react"
import { PropsWithChildren, createContext, useContext } from "react"

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/api/posthog",
    // Capture custom events only
    autocapture: false,
    capture_pageleave: false,
    capture_pageview: false,

    // Disable in development
    loaded: (ph) => {
      if (
        process.env.NODE_ENV !== "production" ||
        window.location.host !== "guild.xyz"
      )
        ph.opt_out_capturing()
    },
  })
}

const PostHogContext = createContext<{
  captureEvent: (event: string, options?: Record<string, any>) => void
}>({
  captureEvent: () => {},
})

const CustomPostHogProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const { id, addresses } = useUser()
  const ph = usePostHog()

  return (
    <PostHogContext.Provider
      value={{
        captureEvent: (event, options) =>
          ph.capture(event, {
            userId: id,
            userAddress: addresses?.[0]?.address,
            ...options,
          }),
      }}
    >
      {children}
    </PostHogContext.Provider>
  )
}

const PostHogProvider = ({ children }: PropsWithChildren<unknown>): JSX.Element => (
  <DefaultPostHogProvider client={posthog}>
    <CustomPostHogProvider>{children}</CustomPostHogProvider>
  </DefaultPostHogProvider>
)

const usePostHogContext = () => useContext(PostHogContext)

export { PostHogProvider, usePostHogContext }
