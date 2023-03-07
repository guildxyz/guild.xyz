import { useWeb3React } from "@web3-react/core"
import useUser from "components/[guild]/hooks/useUser"
import { posthog } from "posthog-js"
import {
  PostHogProvider as DefaultPostHogProvider,
  usePostHog,
} from "posthog-js/react"
import { PropsWithChildren, useEffect } from "react"

const PostHogProvider = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  const posthogFromHook = usePostHog()

  const { account } = useWeb3React()
  const { id } = useUser()

  useEffect(() => {
    if (!account || !id || !posthogFromHook) return
    posthogFromHook.identify(id.toString(), {
      address: account.toLowerCase(),
    })
  }, [account, id, posthogFromHook])

  return <>{children}</>
}

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    // Capture custom events only
    autocapture: false,
    // Disable in development
    loaded: (ph) => {
      // if (process.env.NODE_ENV === 'development') ph.opt_out_capturing()
    },
  })
}

const PostHogWrapper = ({ children }: PropsWithChildren<unknown>): JSX.Element => (
  <DefaultPostHogProvider client={posthog}>
    <PostHogProvider>{children}</PostHogProvider>
  </DefaultPostHogProvider>
)

export default PostHogWrapper
